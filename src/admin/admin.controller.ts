import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { GetAllAdminDto } from 'src/admin/dto/get-all-admin.dto'
import { Admin } from 'src/admin/entities/admin.entity'
import { Paginated } from 'src/types/Paginated'
import { AdminService } from './admin.service'
import { CreateAdminDto } from './dto/create-admin.dto'
import { UpdateAdminDto } from './dto/update-admin.dto'

@ApiTags('admin routes')
@Controller('admin')
@UseInterceptors(ClassSerializerInterceptor)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  create(@Body() createAdminDto: CreateAdminDto): Promise<Admin> {
    return this.adminService.create(createAdminDto)
  }

  @Get()
  findAll(@Query() query: GetAllAdminDto): Promise<Admin[] | Paginated<Admin>> {
    return this.adminService.findAll(query)
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Admin> {
    return this.adminService.findOne(id)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
  ): Promise<Admin> {
    return this.adminService.update(id, updateAdminDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Admin> {
    return this.adminService.remove(id)
  }
}
