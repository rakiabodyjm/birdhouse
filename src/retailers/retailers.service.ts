import { Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { InjectRepository } from '@nestjs/typeorm'
import { isNotEmptyObject } from 'class-validator'
import { GetAllRetailerDto } from 'src/retailers/dto/get-all-retailer.dto'
import SearchRetailerDto from 'src/retailers/dto/search-retailer.dto'
import { Retailer } from 'src/retailers/entities/retailer.entity'
import { Paginated } from 'src/types/Paginated'
import { User } from 'src/user/entities/user.entity'
import { Bcrypt } from 'src/utils/Bcrypt'
import paginateFind from 'src/utils/paginate'
import { Repository } from 'typeorm'
import { CreateRetailerOnlyDto } from './dto/create-retailer-only.dto'
import { CreateRetailerDto } from './dto/create-retailer.dto'
import { UpdateRetailerDto } from './dto/update-retailer.dto'

@Injectable()
export class RetailersService {
  constructor(
    @InjectRepository(Retailer)
    private retailerRepository: Repository<Retailer>,
    private eventEmitter: EventEmitter2,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    // this.relationsToLoad = ['dsp', 'subdistributor', 'user']
  }

  relationsToLoad: string[] = ['dsp', 'subdistributor', 'user']

  async create(createRetailerDto: CreateRetailerDto): Promise<Retailer> {
    const newRetailer = this.retailerRepository.create(createRetailerDto)
    const newRetailerSave = await this.retailerRepository.save(newRetailer)
    const userAccount = (await this.findOne(newRetailerSave.id)).user
    this.eventEmitter.emit('telco-account.created', {
      ...userAccount,
      account_type: 'retailer',
    })
    return newRetailerSave

    // return 'This action adds a new retailer';
  }

  async createRetailerOnly(
    createRetailerOnlyDto: CreateRetailerOnlyDto,
  ): Promise<Retailer> {
    const {
      address,
      dsp,
      first_name,
      last_name,
      phone_number,
      subdistributor,
    } = createRetailerOnlyDto
    const newUser = this.userRepository.create({
      first_name,
      last_name,
      phone_number,
      address1: address,
      username: phone_number,
      email: `${phone_number}@realm1000.com`,
      password: Bcrypt().generatePassword(phone_number),
    })

    const userSave = await this.userRepository.save(newUser)
    const newRetailer = this.retailerRepository.create({
      dsp,
      subdistributor,
      store_name: `${first_name} ${last_name} Retailer`,
      e_bind_number: phone_number,
      id_number: phone_number,
      id_type: phone_number,
      user: userSave,
    })

    // const newRetailer = this.retailerRepository.create(createRetailerOnlyDto)
    // const newRetailerSave = await this.retailerRepository.save(newRetailer)
    const retailerSave = await this.retailerRepository.save(newRetailer)
    const userAccount = (await this.findOne(retailerSave.id)).user
    this.eventEmitter.emit('telco-account.created', {
      ...userAccount,
      account_type: 'retailer',
    })
    return retailerSave

    // return 'This action adds a new retailer';
  }

  async findAll(
    params?: GetAllRetailerDto,
  ): Promise<Paginated<Retailer> | Retailer[] | number> {
    if (!isNotEmptyObject(params)) {
      return this.retailerRepository.find({
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
        // return undefined
        throw new Error(err.message)
      })
    return retailer

    // return `This action returns a #${id} retailer`
  }

  async search(
    query: string,
    options?: Omit<SearchRetailerDto, 'searchQuery'>,
  ) {
    const { subdistributor, dsp } = options
    const searchQuery = `%${query}%`

    const result: Promise<Retailer[]> = this.retailerRepository
      .createQueryBuilder('retailer')
      .leftJoinAndSelect('retailer.subdistributor', 'subdistributor')
      .leftJoinAndSelect('retailer.dsp', 'dsp ')
      .leftJoinAndSelect('retailer.user', 'user')
      .andWhere(
        subdistributor ? `retailer.subdistributor = :subdistributor` : `1=1`,
        {
          subdistributor,
        },
      )
      .andWhere(dsp ? `retailer.dsp = :dsp` : `1=1`, {
        dsp,
      })
      .andWhere(
        `(retailer.store_name like :searchQuery OR retailer.e_bind_number like :searchQuery OR subdistributor.name like :searchQuery OR dsp.dsp_code like :searchQuery) 
        `,
        {
          searchQuery,
        },
      )
      .getMany()

    if (
      (await result).reduce((acc, ea) => {
        if (ea.subdistributor.id !== subdistributor) {
          return true
        }
        return acc
      }, false)
    ) {
      console.log('Discrepancy in Subd')
    }

    return result
  }
  async update(
    id: string,
    updateRetailerDto: UpdateRetailerDto,
  ): Promise<Retailer> {
    const retailer = await this.findOne(id).catch((err) => {
      throw new Error(err.message)
    })

    Object.keys(updateRetailerDto).forEach((key) => {
      retailer[key] = updateRetailerDto[key]
    })

    await this.retailerRepository.save(retailer)
    return retailer

    // return `This action updates a #${id} retailer`
  }

  async remove(id: string): Promise<Retailer> {
    const retailer = await this.findOne(id)
      .catch((err) => {
        throw new Error(err.message)
      })
      .then(async (res) => {
        await this.retailerRepository.delete(res.id)
        return res
      })
    return retailer
  }
}
