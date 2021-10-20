import { PartialType } from '@nestjs/mapped-types'
import { CreateUserDto } from './create-user.dto'

import { Allow, IsEmail, IsOptional, IsPhoneNumber } from 'class-validator'
import { Transform } from 'class-transformer'

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  active: boolean

  @IsEmail(
    {},
    {
      message: `Invalid Email Format`,
    },
  )
  email: string

  @IsPhoneNumber('PH', {
    message: `Invalid Phone Number Format`,
  })
  phone_number: string

  @IsOptional()
  username: string
}
