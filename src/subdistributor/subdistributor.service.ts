import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { isNotEmptyObject } from 'class-validator'
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
  ) {
    this.relationsToLoad = ['user', 'area_id']
  }
  async create(createSubdistributorDto: CreateSubdistributorDto) {
    const { area_id: areaIdString } = createSubdistributorDto
    // const area_id = await this.mapIdService.findById(areaIdString)
    const newSubdistributor = {
      ...createSubdistributorDto,
    }
    const subdistributor = this.subdRepository.create(newSubdistributor)

    const subdSave = await this.subdRepository.save(subdistributor)
    return subdSave
  }

  async findAll(
    params?: GetAllSubdistributor,
  ): Promise<Subdistributor[] | Paginated<Subdistributor>> {
    if (!isNotEmptyObject(params)) {
      return await this.subdRepository.find({
        relations: this.relationsToLoad,
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
  async searchAll(searchQuery: SearchSubdistributorDto['searchQuery']) {
    const likeSearchQuery = Like(`%${searchQuery}%`)

    return await this.subdRepository.find({
      where: [
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
      const subd: Subdistributor = await this.findOne(id)
      console.log('dto', updateSubdistributorDto)
      Object.keys(updateSubdistributorDto).forEach((key) => {
        subd[key] = updateSubdistributorDto[key]
      })
      await this.subdRepository.update(id, subd)
      return subd
    } catch (err) {
      throw new Error(err.message)
    }

    // return `This action updates a #${id} subdistributor`
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
