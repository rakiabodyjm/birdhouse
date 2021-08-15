import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Admin } from 'src/admin/entities/admin.entity'
import { Repository } from 'typeorm'
import { CreateAdminDto } from './dto/create-admin.dto'
import { UpdateAdminDto } from './dto/update-admin.dto'

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}
  async create(createAdminDto: CreateAdminDto) {
    const newAdmin = this.adminRepository.create(createAdminDto)
    await this.adminRepository.save(newAdmin)

    return newAdmin
    // return 'This action adds a new admin'
  }

  async findAll() {
    const admins = await this.adminRepository.find()
    return admins
    // return `This action returns all admin`
  }

  findOne(id: number) {
    return `This action returns a #${id} admin`
  }

  update(id: number, updateAdminDto: UpdateAdminDto) {
    return `This action updates a #${id} admin`
  }

  remove(id: number) {
    return `This action removes a #${id} admin`
  }
}
