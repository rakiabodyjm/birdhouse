import { Optional } from '@nestjs/common'
import { PartialType } from '@nestjs/mapped-types'
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator'

export class LoginUserDto {
  @IsNotEmpty()
  @IsString()
  email: string

  @IsNotEmpty()
  @IsString()
  password: string

  @IsBoolean()
  remember_me: boolean
}
