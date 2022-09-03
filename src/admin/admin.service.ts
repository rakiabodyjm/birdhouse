import { Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { InjectRepository } from '@nestjs/typeorm'
import { isNotEmptyObject } from 'class-validator'
import { GetAllAdminDto } from 'src/admin/dto/get-all-admin.dto'
import { Admin } from 'src/admin/entities/admin.entity'
import { Paginated } from 'src/types/Paginated'
import { UserTypesAndUser } from 'src/types/Roles'
import paginateFind from 'src/utils/paginate'
import { Like, Repository } from 'typeorm'
import { CreateAdminDto } from './dto/create-admin.dto'
import { UpdateAdminDto } from './dto/update-admin.dto'

@Injectable()
export class AdminService {
  relationsToLoad: UserTypesAndUser[]

  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    private eventEmitter: EventEmitter2,
  ) {
    this.relationsToLoad = ['user']
  }

  async create(createAdminDto: CreateAdminDto) {
    const newAdmin = this.adminRepository.create(createAdminDto)
    await this.adminRepository.save(newAdmin)
    const userAccount = (await this.findOne(newAdmin.id)).user
    this.eventEmitter.emit('telco-account.created', {
      ...userAccount,
      account_type: 'admin',
    })

    return newAdmin
    // return 'This action adds a new admin'
  }

  async findAll(query: GetAllAdminDto): Promise<Admin[] | Paginated<Admin>> {
    if (!isNotEmptyObject(query)) {
      const admins = await this.adminRepository.find({
        relations: this.relationsToLoad,
      })
      return admins
    } else {
      return await paginateFind(
        this.adminRepository,
        {
          limit: query.limit,
          page: query.page,
        },
        {
          relations: this.relationsToLoad,
        },
      )
    }

    // return `This action returns all admin`
  }

  findOne(id: string) {
    return this.adminRepository.findOneOrFail(id, {
      relations: this.relationsToLoad,
    })
  }

  async update(id: string, updateAdminDto: UpdateAdminDto) {
    const adminAccount = await this.adminRepository.findOne(id)
    if (!adminAccount) {
      throw new Error(`Admin Account doesn't exist`)
    }
    await this.adminRepository.update(id, {
      ...updateAdminDto,
    })

    return {
      ...adminAccount,
      ...updateAdminDto,
    } as Admin

    // return `This action updates a #${id} admin`
  }

  async remove(id: string) {
    const admin = await this.adminRepository.findOneOrFail(id)
    const deleteResult = await this.adminRepository.delete(id)
    return admin
  }

  search(queryString: string) {
    return this.adminRepository
      .find({
        where: [
          {
            name: Like(`%${queryString}%`),
          },
          {
            user: {
              first_name: Like(`&${queryString}&`),
            },
          },
          {
            user: {
              last_name: Like(`&${queryString}&`),
            },
          },
        ],
        take: 100,
        relations: this.relationsToLoad,
      })
      .catch((err) => {
        throw err
      })
  }
}
