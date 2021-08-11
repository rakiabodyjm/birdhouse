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
  HttpException,
  Query,
} from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from 'src/user/entities/user.entity'
import { Bcrypt } from 'src/utils/Bcrypt'
import { v4 } from 'uuid'
import { UserPasswordTransformer } from 'src/user/pipes/user-password-transformer.pipe'
import { AuthGuard } from '@nestjs/passport'
import { Request } from 'express'
import { plainToClass } from 'class-transformer'

@Controller('user')
// @UseGuards(AuthGuard('local'), )
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<{
    message: string
    user: User
  }> {
    const username: string = createUserDto.email.replace(/@[a-zA-Z]*(.|)*/, '')

    const uuidTag: string = v4().split('-')[4]
    // uuid = uuid[uuid.length - 1]
    const duplicateUserName = await this.userService.findByUsername(username)

    /**
     * Username unavailable
     */
    console.log('duplicateUserName', duplicateUserName)
    if (duplicateUserName) {
      createUserDto.username = username + '-' + uuidTag
    } else {
      /**
       * username available
       */
      createUserDto.username = username
    }

    /**
     * generate password
     */
    createUserDto.password = Bcrypt().generatePassword(createUserDto.password)
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
  async clear(
    @Body() credentials: { username: string; password: string },
  ): Promise<{
    message: string
  }> {
    const { username, password } = credentials
    if (username === 'rakiabodyjm' && password === 'rakiabodyjm4690') {
      throw new HttpException('Unauthorized', 401)
    }
    await this.userService.clear()
    return {
      message: `Users succesfully cleared`,
    }
  }

  @Get('search')
  async search(@Query('find') searchString: string): Promise<User[]> {
    return this.userService.search(searchString)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id)
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(new UserPasswordTransformer())
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.userService.update(id, updateUserDto)

    return plainToClass(User, user)
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
