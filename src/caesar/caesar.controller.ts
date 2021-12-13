import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  ClassSerializerInterceptor,
  UseInterceptors,
  HttpException,
  HttpStatus,
  Query,
  Param,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { GetAllCaesarDto } from 'src/caesar/dto/get-all-caesar.dto'
import { GetCaesarDto } from 'src/caesar/dto/get-caesar.dto'
import { Caesar } from 'src/caesar/entities/caesar.entity'
import { Paginated } from 'src/types/Paginated'
import { RolesArray, UserTypesAndUser } from 'src/types/Roles'
import { UserService } from 'src/user/user.service'
import { CaesarService } from './caesar.service'
import { CreateCaesarDto } from './dto/create-caesar.dto'

@Controller('caesar')
@ApiTags('Caesar Routes')
@UseInterceptors(ClassSerializerInterceptor)
export class CaesarController {
  constructor(
    private readonly caesarService: CaesarService,
    private readonly userService: UserService,
  ) {}

  @Post()
  async create(@Body() createCaesarDto: CreateCaesarDto) {
    //validate input, (one account type at a time)
    if (Object.keys(createCaesarDto).length === 0) {
      throw new HttpException(
        `Missing user type: user, ${RolesArray.join(', ')}`,
        HttpStatus.BAD_REQUEST,
      )
    }
    if (Object.keys(createCaesarDto).length > 1) {
      throw new HttpException(
        `Only one account type at a time, ${RolesArray.join(', ')}`,
        HttpStatus.BAD_REQUEST,
      )
    }
    // get account type submitted
    const accountType = <UserTypesAndUser>Object.keys(createCaesarDto)[0]

    try {
      //get existence of user
      const user = await this.userService.findOneQuery({
        [accountType]: createCaesarDto[accountType],
      })

      return this.caesarService.create({
        account_type: accountType,
        account_id: createCaesarDto[accountType],
        user,
      })
    } catch (err) {
      console.error(err)
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST)
    }
  }

  @Get('account')
  findOneQuery(@Query() getCaesarByAccountQuery: GetCaesarDto) {
    return this.caesarService.findOne(getCaesarByAccountQuery)
  }

  @Get(':id')
  findOne(@Param('id') paramId: string) {
    return this.caesarService.findOne(paramId).catch((err) => {
      console.error('Error caught in caesar findOne')
      throw new NotFoundException(err.message)
    })
  }

  @Get()
  findAll(
    @Query() getAllCaesarDto: GetAllCaesarDto,
  ): Promise<Caesar[] | Paginated<Caesar>> {
    return this.caesarService.findAll(getAllCaesarDto).catch((err) => {
      throw new InternalServerErrorException(err)
    })
  }

  @Delete()
  clear() {
    return this.caesarService.clear()
  }

  // @Get()
  // findAll(@Query() getAllUserDto: GetAllCaesarDto) {
  //   return this.caesarService.findAll(getAllUserDto)
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.caesarService.findOne(+id)
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCaesarDto: UpdateCaesarDto) {
  //   return this.caesarService.update(+id, updateCaesarDto)
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.caesarService.remove(+id)
  // }
}
