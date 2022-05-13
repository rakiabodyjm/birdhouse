import { Injectable } from '@nestjs/common'
import { resolve } from 'path'
import { InjectRepository } from '@nestjs/typeorm'
import { MapId } from 'src/map-ids/entities/map-id.entity'
import { Like, Repository } from 'typeorm'
import { SearchMapDto } from 'src/map-ids/dto/search-map-id.dto'
import { readFileSync } from 'fs'
@Injectable()
export class MapIdsService {
  constructor(
    @InjectRepository(MapId) private mapRepository: Repository<MapId>,
  ) {}

  async findById(id: string) {
    return await this.mapRepository.findOneOrFail(id)
  }

  async findAll() {
    return await this.mapRepository.find()
  }

  async search({ search, page = 0, limit = 100 }: SearchMapDto) {
    let maps: MapId[] = []

    if (search) {
      const queryResult = await Promise.all(
        search
          .split(' ')
          .filter((searchParticle) => /[a-zA-Z0-9]/.test(searchParticle))
          .reduce<MapId[]>((acc, ea) => {
            const returnValue = [
              ...acc,
              this.mapRepository.find({
                where: [
                  {
                    area_name: Like(`%${ea}%`),
                  },
                  {
                    area_id: Like(`%${ea}%`),
                  },
                  {
                    area_parent_pp_name: Like(`%${ea}%`),
                  },
                  {
                    parent_name: Like(`%${ea}%`),
                  },
                  {
                    parent_parent_name: Like(`%${ea}%`),
                  },
                ],
                take: 100,
              }),
            ] as MapId[]
            return returnValue
          }, []),
      ).then((mapIds) => {
        return mapIds
          .flat()
          .filter(
            (mapId, index, array) =>
              array
                .map((mapIdCopy) => mapIdCopy.area_id)
                .indexOf(mapId.area_id) === index,
          )
      })
      return queryResult
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

  async getMapIdsFromArray(args: string[]): Promise<MapId[]> {
    let mapIds: MapId[] = []
    mapIds = await Promise.all(
      args.map(async (ea) => {
        try {
          const mapID = await this.findById(ea)
          if (!mapID) {
            throw new Error('One or More Map ID does not exist')
          }
          return mapID
        } catch (err) {
          throw err
        }
      }),
    )

    return mapIds
  }
}
