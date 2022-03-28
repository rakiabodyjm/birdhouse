import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator'
import { Admin } from 'src/admin/entities/admin.entity'
import { Caesar } from 'src/caesar/entities/caesar.entity'
import { Dsp } from 'src/dsp/entities/dsp.entity'
import { ExistsInDb } from 'src/pipes/validation/ExistsInDb'
import { NoDuplicateInDb } from 'src/pipes/validation/NoDuplicateInDb'
import { Retailer } from 'src/retailers/entities/retailer.entity'
import { Subdistributor } from 'src/subdistributor/entities/subdistributor.entity'
import { User } from 'src/user/entities/user.entity'

const NoWalletId = () =>
  NoDuplicateInDb(Caesar, 'account_id', {
    message: `This account already has Wallet`,
  })

interface WithAccountTypes {
  user: any
  admin: any
  subdistributor: any
  retailer: any
  dsp: any
}
export class CreateCaesarDto implements Partial<WithAccountTypes> {
  @ApiProperty()
  @ExistsInDb(User, 'id')
  @IsOptional()
  @NoWalletId()
  user?: string

  @ApiProperty()
  @ExistsInDb(Admin, 'id')
  @IsOptional()
  @NoWalletId()
  admin?: string

  @ApiProperty()
  @ExistsInDb(Subdistributor, 'id')
  @IsOptional()
  @NoWalletId()
  subdistributor?: string

  @ApiProperty()
  @ExistsInDb(Dsp, 'id')
  @IsOptional()
  @NoWalletId()
  dsp?: string

  @ApiProperty()
  @ExistsInDb(Retailer, 'id')
  @IsOptional()
  @NoWalletId()
  retailer?: string

  @IsOptional()
  @ApiProperty()
  caesar_id: string

  @MinLength(4, {
    message: `Password must be at least 4 characters`,
  })
  @IsOptional()
  password: string
}
