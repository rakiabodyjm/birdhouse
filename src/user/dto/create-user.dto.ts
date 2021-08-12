import { PartialType } from '@nestjs/mapped-types'
import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  MaxLength,
  MinLength,
} from 'class-validator'
import { Dsp } from 'src/dsp/entities/dsp.entity'
import { ExistsInDb } from 'src/dsp/pipes/validation/ExistsInDb'
import { NoDuplicateInDb } from 'src/dsp/pipes/validation/NoDuplicateInDb'
import { User } from 'src/user/entities/user.entity'

export class CreateUserDto {
  @IsNotEmpty({
    message: `First Name can't be empty`,
  })
  @MaxLength(30)
  first_name: string

  @IsNotEmpty({
    message: `Last Name can't be empty`,
  })
  @MaxLength(30)
  last_name: string

  @IsNotEmpty({
    message: 'Phone Number is Empty',
  })
  @IsPhoneNumber('PH', { message: 'Invalid Phone Number' })
  phone_number: string

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
    message: 'Email Already exists',
  })
  email: string

  @IsNotEmpty({
    message: `Password cannot be empty`,
  })
  @MinLength(8, {
    message: 'Password must be at least 8 characters',
  })
  password: string

  @NoDuplicateInDb(User, null, {
    message: 'Username already exists',
  })
  username?: string

  @ExistsInDb(Dsp, null, {
    message: `DSP Account doesn't exist`,
  })
  dsp?: Dsp
}
