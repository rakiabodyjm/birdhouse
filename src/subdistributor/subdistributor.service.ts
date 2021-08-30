import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
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
      return await this.subdRepository.find({})
    } else {
      return await paginateFind<Subdistributor>(this.subdRepository, params, {
        relations: ['user'],
      })
    }
    // return `This action returns all subdistributor`
  }

  findOne(id: number) {
    return `This action returns a #${id} subdistributor`
  }

  update(id: number, updateSubdistributorDto: UpdateSubdistributorDto) {
    return `This action updates a #${id} subdistributor`
  }

  remove(id: number) {
    return `This action removes a #${id} subdistributor`
  }
}
