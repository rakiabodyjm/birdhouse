import { Injectable } from '@nestjs/common'
import { resolve } from 'path'
import * as csv from 'csvtojson'
import { InjectRepository } from '@nestjs/typeorm'
import { MapId } from 'src/map-ids/entities/map-id.entity'
import { getConnection, Like, Repository } from 'typeorm'
import { SearchMapDto } from 'src/map-ids/dto/search-map-id.dto'
import ditoAreaJson from 'root/data/dito-area.json'
import { readFileSync } from 'fs'
@Injectable()
export class MapIdsService {
  constructor(
    @InjectRepository(MapId) private mapRepository: Repository<MapId>,
  ) {}

  async findById(id: string) {
    return await this.mapRepository.findOne(id)
  }
  async findAll() {
    return await this.mapRepository.find()
  }

  async search({ search, page = 0, limit = 100 }: SearchMapDto) {
    let maps = []

    if (search) {
      maps = await this.mapRepository
        .find({
          where: [
            {
              area_name: Like(`%${search}%`),
            },
            {
              area_id: Like(`%${search}%`),
            },
            {
              area_parent_pp_name: Like(`%${search}%`),
            },
            {
              parent_name: Like(`%${search}%`),
            },
            {
              parent_parent_name: Like(`%${search}%`),
            },
          ],
        })
        .then((res) => {
          return res.slice(0, limit)
        })
    } else {
      maps = await this.mapRepository.find({
        skip: page * limit,
        take: limit,
      })
    }

    return maps
  }

  async populate() {
    const maps: MapId[] = []

    await this.clear()
    // await csv()
    //   .fromFile(resolve(process.cwd(), 'data', 'dito-area.csv'))
    //   .then((res) => {
    //     maps = res.slice(1, res.length).map(
    //       (ea) =>
    //         ({
    //           area_id: ea?.field1 || '',
    //           area_name: ea?.field2 || '',
    //           parent_name: ea?.field3 || '',
    //           parent_parent_name: ea?.field4 || '',
    //           area_parent_pp_name: ea?.field5 || '',
    //         } as MapId),
    //     )
    //   })

    // writeFile(
    //   resolve(process.cwd(), 'data', 'dito-area.json'),
    //   JSON.stringify(maps),
    //   (err) => {
    //     console.error(err)
    //   },
    // )

    // const records = Promise.all(
    //   maps.map(async (ea) => {
    //     const map: MapId = this.mapRepository.create(ea)
    //     this.mapRepository.save(map)
    //   }),
    // )
    const newArea: MapId[] = JSON.parse(
      readFileSync(resolve(process.cwd(), 'data', 'dito-area.json'), {
        encoding: 'utf-8',
      }),
    )

    const errors = []
    for (let i = 0; i < newArea.length; i++) {
      let errFound = false

      await this.mapRepository
        .createQueryBuilder()
        .insert()
        .into(MapId)
        .values(newArea[i])
        .execute()
        .catch((err) => {
          console.log(err)
          errFound = true
        })

      if (errFound) {
        break
      }
    }

    return {
      records: 'done',
      errors,
    }
  }
  async clear() {
    await this.mapRepository.clear()
    return {
      mapIds: (await this.mapRepository.find()).length,
    }
  }
}
