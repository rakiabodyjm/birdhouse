import { Injectable, Query } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { isNotEmptyObject } from 'class-validator'
import { GetAllAdminDto } from 'src/admin/dto/get-all-admin.dto'
import { Admin } from 'src/admin/entities/admin.entity'
import { Paginated } from 'src/types/Paginated'
import { UserTypesAndUser } from 'src/types/Roles'
import paginateFind from 'src/utils/paginate'
import { Repository } from 'typeorm'
import { CreateAdminDto } from './dto/create-admin.dto'
import { UpdateAdminDto } from './dto/update-admin.dto'

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
  ) {
    this.relationsToLoad = ['user']
  }
  relationsToLoad: UserTypesAndUser[]

  async create(createAdminDto: CreateAdminDto) {
    const newAdmin = this.adminRepository.create(createAdminDto)
    await this.adminRepository.save(newAdmin)

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
    console.log('admin delete result', deleteResult)
    return admin
  }
}
