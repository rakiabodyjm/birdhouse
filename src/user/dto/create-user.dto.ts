import {
  IsNotEmpty,
  IsNumberString,
  IsPhoneNumber,
  MaxLength,
} from 'class-validator'

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
}
