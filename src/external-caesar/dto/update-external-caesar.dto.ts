import { PartialType } from '@nestjs/swagger'
import { IsEmail, IsIn, IsOptional, IsPhoneNumber } from 'class-validator'
import { RolesArray, UserTypesAndUser } from 'src/types/Roles'
import { CreateExternalCaesarDto } from './create-external-caesar.dto'

export class UpdateExternalCaesarDto extends PartialType(
  CreateExternalCaesarDto,
) {
  @IsOptional()
  first_name: string

  @IsOptional()
  last_name: string

  @IsOptional()
  @IsPhoneNumber('PH')
  cp_number: string

  @IsOptional()
  @IsEmail()
  email: string

  @IsOptional()
  password: string

  @IsOptional()
  @IsIn([...RolesArray, 'user'])
  role: UserTypesAndUser
}
