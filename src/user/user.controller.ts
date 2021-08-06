import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { Request } from 'express'
import { User } from 'src/user/entities/user.entity'
import { SQLDateGenerator } from 'src/utils/SQLDateGenerator'
import { DeleteResult } from 'typeorm'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<{
    message: string
    user: User
  }> {
    const user = await this.userService.create(createUserDto)
    return {
      message: 'User Created',
      user: user,
    }
  }

  @Get('all')
  findAll(): Promise<User[]> {
    return this.userService.findAll()
  }

  @Delete('clear')
  clear(): { message: string } {
    return this.userService.clear()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(id, updateUserDto)
  }

  @Patch('suspend/:id')
  async suspend(@Param('id') id: string): Promise<User> {
    return this.userService.update(id, {
      active: false,
    })
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
  ): Promise<{ message: string; user: User }> {
    const user = await this.userService.delete(id)
    return {
      message: 'User Account Deleted',
      user,
    }
  }
}
