import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { classToPlain, plainToClass } from 'class-transformer'
import { isNotEmptyObject } from 'class-validator'
import { GetAllSubdistributor } from 'src/subdistributor/dto/get-subdistributor.dto'
import { Subdistributor } from 'src/subdistributor/entities/subdistributor.entity'
import { Paginated } from 'src/types/Paginated'
import paginateFind from 'src/utils/paginate'
import { Repository } from 'typeorm'
import { CreateSubdistributorDto } from './dto/create-subdistributor.dto'
import { UpdateSubdistributorDto } from './dto/update-subdistributor.dto'

@Injectable()
export class SubdistributorService {
  constructor(
    @InjectRepository(Subdistributor)
    private subdRepository: Repository<Subdistributor>,
  ) {}
  async create(createSubdistributorDto: CreateSubdistributorDto) {
    const subdistributor = this.subdRepository.create(createSubdistributorDto)

    const subdSave = await this.subdRepository.save(subdistributor)
    return subdSave
  }

  async findAll(
    params?: GetAllSubdistributor,
  ): Promise<Subdistributor[] | Paginated<Subdistributor>> {
    if (!isNotEmptyObject(params)) {
      return await this.subdRepository.find({ relations: ['user'] })
    } else {
      return await paginateFind<Subdistributor>(this.subdRepository, params, {
        relations: ['user'],
      })
    }
    // return `This action returns all subdistributor`
  }

  async findOne(id: string) {
    try {
      const subd = await this.subdRepository.findOneOrFail(id, {
        relations: ['user'],
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
}
