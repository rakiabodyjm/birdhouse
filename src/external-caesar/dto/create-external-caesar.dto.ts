import { IsEmail, IsIn, IsNotEmpty, IsPhoneNumber } from 'class-validator'
import { RolesArray, UserTypesAndUser } from 'src/types/Roles'

export class CreateExternalCaesarDto {
  @IsNotEmpty()
  first_name: string

  @IsNotEmpty()
  last_name: string

  @IsPhoneNumber('PH')
  cp_number: string

  @IsEmail()
  email: string

  @IsNotEmpty()
  password: string

  @IsIn([...RolesArray, 'user'])
  role: UserTypesAndUser
}
