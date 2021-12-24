import { ApiProperty } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'
import { Admin } from 'src/admin/entities/admin.entity'
import { Dsp } from 'src/dsp/entities/dsp.entity'
import { ExistsInDb } from 'src/pipes/validation/ExistsInDb'
import { Retailer } from 'src/retailers/entities/retailer.entity'
import { Subdistributor } from 'src/subdistributor/entities/subdistributor.entity'
import { User } from 'src/user/entities/user.entity'

export class GetCaesarDto {
  @ApiProperty()
  @ExistsInDb(User, 'id')
  @IsOptional()
  user?: string

  @ApiProperty()
  @ExistsInDb(Admin, 'id')
  @IsOptional()
  admin?: string

  @ApiProperty()
  @ExistsInDb(Subdistributor, 'id')
  @IsOptional()
  subdistributor?: string

  @ApiProperty()
  @ExistsInDb(Dsp, 'id')
  @IsOptional()
  dsp?: string

  @ApiProperty()
  @ExistsInDb(Retailer, 'id')
  @IsOptional()
  retailer?: string
}
