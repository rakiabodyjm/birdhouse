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
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
} from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from 'src/user/entities/user.entity'
import { v4 } from 'uuid'
import { ApiTags } from '@nestjs/swagger'
import { GetAllUserDto } from 'src/user/dto/get-all-user.dto'
import { AuthGuard } from '@nestjs/passport'
import { ExistsInDb } from 'src/pipes/validation/ExistsInDb'
import { UserTransformer } from 'src/user/pipes/user-dto-transformer'

@Controller('user')
@ApiTags('User Routes')
/**
 * serializes plain objects into classes to apply validation and transformation
 */
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(new UserTransformer()) createUserDto: CreateUserDto,
  ): Promise<{
    message: string
    user: User
  }> {
    const username: string = createUserDto.email.replace(/@[a-zA-Z]*(.|)*/, '')

    const uuidTag: string = v4().split('-')[4]
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

    // /**
    //  * generate password
    //  */
    const user = await this.userService.create(createUserDto)
    return {
      message: 'User Created',
      user: user,
    }
  }

  @Get('all')
  async findAll(@Query() query: GetAllUserDto) {
    return await this.userService.findAll(query)
  }

  @Delete('clear')
  @UseGuards(AuthGuard('local'))
  async clear(): Promise<{
    message: string
  }> {
    await this.userService.clear()
    return {
      message: `Users succesfully cleared`,
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService
      .findOne(id)
      .then((res) => {
        return res
      })
      .catch((err) => {
        throw new HttpException(err.message, HttpStatus.BAD_REQUEST)
      })
  }

  @Patch(':id')
  async update(
    @Param() id: string,
    @Body(new UserTransformer()) updateUserDto: UpdateUserDto,
    // @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    try {
      console.log('updateuserdto', updateUserDto)
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
      throw new HttpException(`User Account not found`, HttpStatus.BAD_REQUEST)
    }
    return {
      message: 'User Account Deleted',
      user,
    }
  }
}
