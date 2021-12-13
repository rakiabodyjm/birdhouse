import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsUUID } from 'class-validator'
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

export class CreateCaesarDto {
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
}
