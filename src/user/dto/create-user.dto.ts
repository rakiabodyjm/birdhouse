import { PartialType } from '@nestjs/mapped-types'
import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  MaxLength,
  MinLength,
} from 'class-validator'
import { Admin } from 'src/admin/entities/admin.entity'
import { DspService } from 'src/dsp/dsp.service'
import { Dsp } from 'src/dsp/entities/dsp.entity'
import { ExistsInDb } from 'src/pipes/validation/ExistsInDb'
import { NoDuplicateInDb } from 'src/pipes/validation/NoDuplicateInDb'
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
  @NoDuplicateInDb(User, null, {
    message: 'Email Already used',
  })
  email: string

  @Transform(({ value }) => Bcrypt().generatePassword(value))
  @ApiProperty()
  @IsNotEmpty({
    message: `Password cannot be empty`,
  })
  @MinLength(8, {
    message: 'Password must be at least 8 characters',
  })
  password: string

  @ApiProperty()
  @NoDuplicateInDb(User, null, {
    message: 'Username already used',
  })
  username?: string

  @IsOptional()
  @ApiProperty({
    type: 'string',
  })
  @ExistsInDb(Dsp, null, {
    message: `DSP Account doesn't exist`,
  })
  dsp: Dsp

  @IsOptional()
  @ExistsInDb(Admin, null, {
    message: `Admin Account doesn't exist`,
  })
  admin: Admin
}
