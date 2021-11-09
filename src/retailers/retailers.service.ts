import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { isNotEmptyObject } from 'class-validator'
import { GetAllRetailerDto } from 'src/retailers/dto/get-all-retailer.dto'
import { Retailer } from 'src/retailers/entities/retailer.entity'
import { Paginated } from 'src/types/Paginated'
import paginateFind from 'src/utils/paginate'
import { Like, Repository } from 'typeorm'
import { CreateRetailerDto } from './dto/create-retailer.dto'
import { UpdateRetailerDto } from './dto/update-retailer.dto'

@Injectable()
export class RetailersService {
  constructor(
    @InjectRepository(Retailer)
    private retailerRepository: Repository<Retailer>,
  ) {
    this.relationsToLoad = ['dsp', 'subdistributor', 'user']
  }

  relationsToLoad: string[]

  async create(createRetailerDto: CreateRetailerDto): Promise<Retailer> {
    const newRetailer = this.retailerRepository.create(createRetailerDto)
    const newRetailerSave = await this.retailerRepository.save(newRetailer)

    return newRetailerSave

    // return 'This action adds a new retailer';
  }

  async findAll(
    params?: GetAllRetailerDto,
  ): Promise<Paginated<Retailer> | Retailer[] | number> {
    if (!isNotEmptyObject(params)) {
      return await this.retailerRepository.find({
        // relations: ['user', 'subdistributor', 'dsp'],
        relations: this.relationsToLoad,
      })
    }
    const whereQuery: { subdistributor?: string; dsp?: string } = {}
    const { subdistributor, dsp } = params
    if (subdistributor) {
      whereQuery['subdistributor'] = subdistributor
    }
    if (dsp) {
      whereQuery['dsp'] = dsp
    }
    const retailerQuery = await paginateFind<Retailer>(
      this.retailerRepository,
      params,
      {
        // relations: ['subdistributor', 'dsp'],
        relations: this.relationsToLoad,
        ...(isNotEmptyObject(whereQuery) && {
          where: whereQuery,
        }),
      },
    )

    if (params?.countOnly) {
      return retailerQuery.metadata.total
    }
    return retailerQuery
    // return `This action returns all retailers`
  }

  async findOne(id: string): Promise<Retailer | undefined> {
    const retailer: Retailer | undefined = await this.retailerRepository
      .findOneOrFail(id, {
        // relations: ['user', 'subdistributor', 'dsp'],
        relations: this.relationsToLoad,
      })
      .then((res) => {
        return res
      })
      .catch((err) => {
        // console.log(err)
        // return undefined
        throw err
      })
    return retailer

    // return `This action returns a #${id} retailer`
  }

  async search(query: string) {
    return this.retailerRepository.find({
      where: [
        {
          id: Like(`%${query}%`),
        },
        {
          e_bind_number: Like(`%${query}%`),
        },
        {
          store_name: Like(`%${query}%`),
        },
        {
          subdistributor: {
            name: Like(`%${query}%`),
          },
        },
        {
          id_number: Like(`%${query}%`),
        },
      ],
      relations: this.relationsToLoad,
      take: 100,
    })
  }
  async update(
    id: string,
    updateRetailerDto: UpdateRetailerDto,
  ): Promise<Retailer> {
    const retailer = await this.findOne(id).catch((err) => {
      throw err
    })

    Object.keys(updateRetailerDto).forEach((key) => {
      retailer[key] = updateRetailerDto[key]
    })

    await this.retailerRepository.update(id, retailer)
    return retailer

    // return `This action updates a #${id} retailer`
  }

  async remove(id: string): Promise<Retailer> {
    const retailer = await this.findOne(id)
      .catch((err) => {
        throw err
      })
      .then(async (res) => {
        await this.retailerRepository.delete(res.id)
        return res
      })
    return retailer
  }
}
