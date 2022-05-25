import { Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { InjectRepository } from '@nestjs/typeorm'
import { isNotEmptyObject } from 'class-validator'
import { CaesarService } from 'src/caesar/caesar.service'
import { MapIdsService } from 'src/map-ids/map-ids.service'
import { GetAllSubdistributor } from 'src/subdistributor/dto/get-subdistributor.dto'
import { SearchSubdistributorDto } from 'src/subdistributor/dto/search-subdistributor.dto'
import { Subdistributor } from 'src/subdistributor/entities/subdistributor.entity'
import { Paginated } from 'src/types/Paginated'
import paginateFind from 'src/utils/paginate'
import { Like, Repository } from 'typeorm'
import { CreateSubdistributorDto } from './dto/create-subdistributor.dto'
import { UpdateSubdistributorDto } from './dto/update-subdistributor.dto'

@Injectable()
export class SubdistributorService {
  relationsToLoad: string[]
  constructor(
    @InjectRepository(Subdistributor)
    private subdRepository: Repository<Subdistributor>,
    private caesarService: CaesarService,
    private mapidService: MapIdsService,
    private eventEmitter: EventEmitter2,
  ) {
    this.relationsToLoad = ['user']
  }
  async create(createSubdistributorDto: CreateSubdistributorDto) {
    const { area_id: areaIdString } = createSubdistributorDto
    // const area_id = await this.mapIdService.findById(areaIdString)
    const newSubdistributor = {
      ...createSubdistributorDto,
    }
    const area_id = await this.mapidService.findById(areaIdString)

    const subdistributor = this.subdRepository.create({
      ...newSubdistributor,
      area_id,
    })

    console.log(subdistributor)
    const subdSave = await this.subdRepository.save(subdistributor)

    const userAccount = (await this.findOne(subdSave.id)).user
    this.eventEmitter.emit('telco-account.created', {
      ...userAccount,
      account_type: 'subdistributor',
    })
    return subdSave
  }

  async findAll(
    params?: GetAllSubdistributor,
  ): Promise<Subdistributor[] | Paginated<Subdistributor>> {
    // console.log(Object.keys(this.caesarService))
    if (!isNotEmptyObject(params)) {
      return await this.subdRepository
        .find({
          relations: this.relationsToLoad,
        })
        .then(async (res) => {
          // return Promise.all(
          //   res.map(
          //     async (subd) =>
          //       ({
          //         ...subd,
          //         caesar_wallet: await this.caesarService
          //           .findOne({
          //             subdistributor: subd.id,
          //           })
          //           .catch((err) => null),
          //       } as Subdistributor),
          //   ),
          // )
          // return (await this.caesarService.injectCaesar(
          //   res,
          //   'subdistributor',
          // )) as Subdistributor[]
          return res
        })
    } else {
      return await paginateFind<Subdistributor>(this.subdRepository, params, {
        relations: this.relationsToLoad,
      })
    }
    // return `This action returns all subdistributor`
  }

  /**
   *
   * @param searchQuery
   * Search by subdistributor's name, area_name, user last_name first_name
   *
   */
  async searchAll(searchQuery?: SearchSubdistributorDto['searchQuery']) {
    const likeSearchQuery = searchQuery ? Like(`%${searchQuery}%`) : undefined

    return await this.subdRepository.find({
      ...(likeSearchQuery && {
        where: [
          {
            id: likeSearchQuery,
          },
          {
            name: likeSearchQuery,
          },
          {
            area_id: {
              area_name: likeSearchQuery,
            },
          },
          {
            user: {
              last_name: likeSearchQuery,
            },
          },
          {
            user: {
              first_name: likeSearchQuery,
            },
          },
        ],
      }),
      relations: ['area_id', 'user'],
      take: 100,
    })
  }

  async findOne(id: string) {
    try {
      const subd = await this.subdRepository.findOneOrFail(id, {
        relations: this.relationsToLoad,
      })
      if (subd) {
        return subd
      }
    } catch (err) {
      throw new Error(err.message)
    }

    // return `This action returns a #${id} subdistributor`
  }

  async update(id: string, updateSubdistributorDto: UpdateSubdistributorDto) {
    try {
      const subd = await this.findOne(id)
      Object.keys(updateSubdistributorDto).forEach((key) => {
        subd[key] = updateSubdistributorDto[key]
      })
      await this.subdRepository.save(subd)
      return subd
    } catch (err) {
      throw new Error(err.message)
    }
  }

  async remove(id: string) {
    try {
      const subd = await this.findOne(id)
      const deleteResult = await this.subdRepository.delete(subd.id)
      console.log(deleteResult)
      return subd
    } catch (err) {
      throw new Error(err.message)
    }

    // return `This action removes a #${id} subdistributor`
  }
  async clear(): Promise<void> {
    await this.subdRepository.delete({})
  }
}
