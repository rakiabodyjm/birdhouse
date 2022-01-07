import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpException,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
} from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from 'src/user/entities/user.entity'
import { v4 } from 'uuid'
import { ApiTags } from '@nestjs/swagger'
import { GetAllUserDto } from 'src/user/dto/get-all-user.dto'
import { UserTransformer } from 'src/user/pipes/user-dto-transformer'
import { GetUserDto } from 'src/user/dto/get-user.dto'
import { Paginated } from 'src/types/Paginated'
import { plainToClass } from 'class-transformer'
import { GetUserDtoQuery } from 'src/user/dto/get-user-query.dto'

@ApiTags('User Routes')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(
    @Body(new UserTransformer())
    createUserDto: CreateUserDto,
  ): Promise<{
    message: string
    user: User
  }> {
    try {
      const username: string = createUserDto.email.replace(
        /@[a-zA-Z]*(.|)*/,
        '',
      )

      const uuidTag: string = v4().split('-')[4]
      const duplicateUserName = await this.userService.findByUsername(username)

      /**
       * Username unavailable
       */
      if (duplicateUserName) {
        createUserDto.username = username + '-' + uuidTag
      } else {
        /**
         * username available
         */
        createUserDto.username = username
      }

      const user = await this.userService.create(createUserDto)
      return {
        message: 'User Created',
        user: user,
      }
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST)
    }
  }

  @Get()
  async findAll(
    @Query() query: GetAllUserDto,
  ): Promise<Paginated<User> | User[]> {
    return await this.userService.findAll(plainToClass(GetAllUserDto, query))
  }

  @Get('query')
  async getUserWhere(@Query() query: GetUserDtoQuery) {
    try {
      const user = await this.userService.findOneQuery(query)
      return user
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST)
    }
  }

  @Get('search')
  async search(@Query('find') searchString: string): Promise<User[]> {
    return this.userService
      .search(searchString)
      .then((res) => {
        return res
      })
      .catch((err) => {
        throw new HttpException(err, 400)
      })
  }

  @Delete('clear')
  async clear(): Promise<{
    message: string
  }> {
    await this.userService.clear()
    return {
      message: `Users succesfully cleared`,
    }
  }

  @Patch(':id')
  async update(
    @Param() id: string,
    @Body(new UserTransformer()) updateUserDto: UpdateUserDto,
  ): Promise<User> {
    try {
      const user = await this.userService.update(id, updateUserDto)
      return user
    } catch (err) {
      throw new HttpException(err.message, 400)
    }
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
    let user: null | User = null
    try {
      user = await this.userService.delete(id)
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
    return {
      message: 'User Account Deleted',
      user,
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query() query: GetUserDto): Promise<User> {
    return this.userService
      .findOne(id, query.cache)
      .then((res) => {
        return res
      })
      .catch((err) => {
        throw new HttpException(err.message, HttpStatus.BAD_REQUEST)
      })
  }
}
