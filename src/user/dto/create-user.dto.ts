import { ApiProperty, getSchemaPath } from '@nestjs/swagger'

import { Transform } from 'class-transformer'
import {
  Allow,
  IsEmail,
  IsEmpty,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  MaxLength,
  MinLength,
} from 'class-validator'
import { CreateAdminDto } from 'src/admin/dto/create-admin.dto'
import { Admin } from 'src/admin/entities/admin.entity'
import { CreateDspDto } from 'src/dsp/dto/create-dsp.dto'
import { Dsp } from 'src/dsp/entities/dsp.entity'
import { NoDuplicateInDb } from 'src/pipes/validation/NoDuplicateInDb'
import { CreateRetailerDto } from 'src/retailers/dto/create-retailer.dto'
import { Retailer } from 'src/retailers/entities/retailer.entity'
import { CreateSubdistributorDto } from 'src/subdistributor/dto/create-subdistributor.dto'
import { Subdistributor } from 'src/subdistributor/entities/subdistributor.entity'
import { User } from 'src/user/entities/user.entity'
import { Bcrypt } from 'src/utils/Bcrypt'

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty({
    message: `First Name can't be empty`,
  })
  @MaxLength(30)
  first_name: string

  @ApiProperty()
  @IsNotEmpty({
    message: `Last Name can't be empty`,
  })
  @MaxLength(30)
  last_name: string

  @ApiProperty()
  @IsNotEmpty({
    message: 'Phone Number is Empty',
  })
  @IsPhoneNumber('PH', { message: 'Invalid Phone Number' })
  phone_number: string

  @ApiProperty()
  @IsEmail(
    {},
    {
      message: `Email format invalid`,
    },
  )
  @IsNotEmpty({
    message: 'Email cannot be empty',
  })
  @NoDuplicateInDb(User, 'email', {
    message: 'Email Already used',
  })
  email: string

  @IsNotEmpty({
    message: `Address 1 is Required`,
  })
  address1: string

  @MaxLength(255, {
    message: `Address 2 too long`,
  })
  @IsOptional()
  address2: string

  @Transform(({ value }) => {
    return Bcrypt().generatePassword(value)
  })
  @ApiProperty()
  @IsNotEmpty({
    message: `Password cannot be empty`,
  })
  @MinLength(8, {
    message: 'Password must be at least 8 characters',
  })
  password: string

  @IsOptional()
  @ApiProperty()
  @NoDuplicateInDb(User, null, {
    message: 'Username already used',
  })
  username?: string

  @IsOptional()
  @ApiProperty({
    type: CreateDspDto,
    required: false,
  })
  dsp?: Dsp

  @IsOptional()
  @ApiProperty({
    type: CreateAdminDto,
    required: false,
  })
  admin?: Admin

  @IsOptional()
  @ApiProperty({
    type: CreateSubdistributorDto,
    required: false,
  })
  subdistributor?: Subdistributor

  @Allow()
  // @IsOptional()
  @ApiProperty({
    type: CreateRetailerDto,
    required: false,
  })
  retailer?: Retailer

  @IsEmpty({
    message: `Created at and Updated at values are fixed`,
  })
  create_at: Date

  @IsEmpty({
    message: `Created at and Updated at values are fixed`,
  })
  updated_at
}
