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
  BadRequestException,
  UseGuards,
  Patch,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Role } from 'src/auth/decorators/roles.decorator'
import { RolesGuard } from 'src/auth/guards/roles.guard'
import { GetAllCaesarDto } from 'src/caesar/dto/get-all-caesar.dto'
import { GetCaesarDto } from 'src/caesar/dto/get-caesar.dto'
import { SearchCaesarDto } from 'src/caesar/dto/search-caesar.dto'
import { UpdateCaesarDto } from 'src/caesar/dto/update-caesar.dto'
import { Caesar } from 'src/caesar/entities/caesar.entity'
import { Paginated } from 'src/types/Paginated'
import { Roles, RolesArray, UserTypesAndUser } from 'src/types/Roles'
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

    const password = createCaesarDto.password
    delete createCaesarDto.password
    if (Object.keys(createCaesarDto).length > 1) {
      throw new HttpException(
        `Only one account type at a time, ${RolesArray.join(', ')}`,
        HttpStatus.BAD_REQUEST,
      )
    }
    // get account type submitted
    const accountType = <UserTypesAndUser>Object.keys(createCaesarDto)[0]
    if (accountType.length === 0) {
      throw new BadRequestException(`Must specify account type`)
    }
    try {
      //get existence of user
      const user = await this.userService.findOneQuery({
        [accountType]: createCaesarDto[accountType],
      })

      return this.caesarService
        .create({
          // account_type: accountType,
          userAccount: user,
          // [accountType]: createCaesarDto[accountType],
          [accountType]: createCaesarDto[accountType],
          password,
        })
        .catch((err) => {
          // console.log('errmessage', err)
          throw new InternalServerErrorException(err.message)
        })
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST)
    }
  }

  @Get('search')
  search(
    @Query() searchCaesarDto: SearchCaesarDto,
  ): Promise<Paginated<Caesar>> {
    return this.caesarService.search(searchCaesarDto).catch((err) => {
      throw new InternalServerErrorException(err.message)
    })
  }

  @Get('search-v2')
  searchV2(@Query() searchCaesarDto: SearchCaesarDto) {
    return this.caesarService.searchV2(searchCaesarDto)
  }

  @Get('account')
  findOneQuery(@Query() getCaesarByAccountQuery: GetCaesarDto) {
    return this.caesarService.findOne(getCaesarByAccountQuery).catch((err) => {
      throw new NotFoundException(err.message)
    })
  }

  @Get(':id')
  findOne(@Param('id') paramId: string) {
    return this.caesarService.findOne(paramId).catch((err) => {
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

  @Delete(':id')
  deleteOne(@Param('id') id: string) {
    return this.caesarService.deleteOne(id)
  }

  @Role(Roles.ADMIN)
  @UseGuards(RolesGuard)
  @Post('topup')
  async topup(@Body() body: { caesar: string; amount: number }) {
    const caesar = await this.caesarService.findOne(body.caesar)
    return this.caesarService.pay(caesar, body.amount)
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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCaesarDto: UpdateCaesarDto) {
    console.log(updateCaesarDto)
    return this.caesarService.update(id, updateCaesarDto)
  }
}
