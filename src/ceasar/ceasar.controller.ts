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
import { GetAllCeasarDto } from 'src/ceasar/dto/get-all-ceasar.dto'
import { GetCeasarDto } from 'src/ceasar/dto/get-ceasar.dto'
import { Ceasar } from 'src/ceasar/entities/ceasar.entity'
import { Paginated } from 'src/types/Paginated'
import { RolesArray, UserTypesAndUser } from 'src/types/Roles'
import { UserService } from 'src/user/user.service'
import { CeasarService } from './ceasar.service'
import { CreateCeasarDto } from './dto/create-ceasar.dto'

@Controller('ceasar')
@ApiTags('Ceasar Routes')
@UseInterceptors(ClassSerializerInterceptor)
export class CeasarController {
  constructor(
    private readonly ceasarService: CeasarService,
    private readonly userService: UserService,
  ) {}

  @Post()
  async create(@Body() createCeasarDto: CreateCeasarDto) {
    //validate input, (one account type at a time)
    if (Object.keys(createCeasarDto).length === 0) {
      throw new HttpException(
        `Missing user type: user, ${RolesArray.join(', ')}`,
        HttpStatus.BAD_REQUEST,
      )
    }
    if (Object.keys(createCeasarDto).length > 1) {
      throw new HttpException(
        `Only one account type at a time, ${RolesArray.join(', ')}`,
        HttpStatus.BAD_REQUEST,
      )
    }
    // get account type submitted
    const accountType = <UserTypesAndUser>Object.keys(createCeasarDto)[0]

    try {
      //get existence of user
      const user = await this.userService.findOneQuery({
        [accountType]: createCeasarDto[accountType],
      })

      return this.ceasarService.create({
        account_type: accountType,
        account_id: createCeasarDto[accountType],
        user,
      })
    } catch (err) {
      console.error(err)
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST)
    }
  }

  @Get('account')
  findOneQuery(@Query() getCeasarByAccountQuery: GetCeasarDto) {
    return this.ceasarService.findOne(getCeasarByAccountQuery)
  }

  @Get(':id')
  findOne(@Param('id') paramId: string) {
    return this.ceasarService.findOne(paramId).catch((err) => {
      console.error('Error caught in ceasar findOne')
      throw new NotFoundException(err.message)
    })
  }

  @Get()
  findAll(
    @Query() getAllCeasarDto: GetAllCeasarDto,
  ): Promise<Ceasar[] | Paginated<Ceasar>> {
    return this.ceasarService.findAll(getAllCeasarDto).catch((err) => {
      throw new InternalServerErrorException(err)
    })
  }

  @Delete()
  clear() {
    return this.ceasarService.clear()
  }

  // @Get()
  // findAll(@Query() getAllUserDto: GetAllCeasarDto) {
  //   return this.ceasarService.findAll(getAllUserDto)
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.ceasarService.findOne(+id)
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCeasarDto: UpdateCeasarDto) {
  //   return this.ceasarService.update(+id, updateCeasarDto)
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.ceasarService.remove(+id)
  // }
}
