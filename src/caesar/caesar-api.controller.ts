import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  UseInterceptors,
} from '@nestjs/common'
import { ApiProperty, ApiTags } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator'
import { CreateWalletParams } from 'src/caesar/ceasar-api.service'

export class CreateWalletDto {
  @ApiProperty()
  @IsNotEmpty()
  lastname: string

  @ApiProperty()
  @IsNotEmpty()
  firstname: string

  @ApiProperty()
  @IsOptional()
  middlename: ''

  @ApiProperty()
  @IsNotEmpty()
  contact_no: string

  @ApiProperty()
  @IsEmail()
  email_address: string

  @ApiProperty()
  @IsNotEmpty()
  password: string

  @ApiProperty()
  @IsNotEmpty()
  user_type: CreateWalletParams['j']

  @ApiProperty()
  @IsNotEmpty()
  country: CreateWalletParams['k']
}

@Controller('caesar-api')
@ApiTags('CaesarApi Routes')
@UseInterceptors(ClassSerializerInterceptor)
export class CaesarApiController {
  constructor() {}

  @Get()
  getAll() {
    return 'hello world'
  }

  @Post()
  async create(@Body() createWalletDto: CreateWalletDto) {
    console.log(createWalletDto)
  }
}
