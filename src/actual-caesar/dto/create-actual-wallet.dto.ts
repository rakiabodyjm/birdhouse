import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
} from 'class-validator'

export class CreateActualWalletDto {
  @IsNotEmpty()
  lastname: string

  @IsNotEmpty()
  firstname: string

  @IsOptional()
  middlename: string

  @IsPhoneNumber('PH')
  contact_no: string

  @IsEmail()
  email_address: string

  @IsNotEmpty()
  password: string

  @IsIn([
    'User',
    'Retailer',
    'DSP',
    'Sub-Distributor',
    'Distributor',
    'Master Distributor',
  ])
  user_type:
    | 'User'
    | 'Retailer'
    | 'DSP'
    | 'Sub-Distributor'
    | 'Distributor'
    | 'Master Distributor'

  @IsIn(['PH', 'US'])
  country: string
}
