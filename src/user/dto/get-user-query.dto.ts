import { ApiProperty } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'
import { Admin } from 'src/admin/entities/admin.entity'
import { Dsp } from 'src/dsp/entities/dsp.entity'
import { ExistsInDb } from 'src/pipes/validation/ExistsInDb'
import { Retailer } from 'src/retailers/entities/retailer.entity'
import { Subdistributor } from 'src/subdistributor/entities/subdistributor.entity'
import { User } from 'src/user/entities/user.entity'

export class GetUserDtoQuery {
  @ApiProperty()
  @ExistsInDb(User, 'id', {
    message: `User does not exist`,
  })
  @IsOptional()
  user?: string

  @ApiProperty()
  @ExistsInDb(Subdistributor, 'id', {
    message: `Subdistirbutor does not exist`,
  })
  @IsOptional()
  subdistributor?: string

  @ApiProperty()
  @ExistsInDb(Dsp, 'id', {
    message: `Dsp does not exist`,
  })
  @IsOptional()
  dsp?: string

  @ApiProperty()
  @ExistsInDb(Retailer, 'id', {
    message: `Retailer does not exist`,
  })
  @IsOptional()
  retailer?: string

  @ApiProperty()
  @ExistsInDb(Admin, 'id', {
    message: `Admin does not exist`,
  })
  @IsOptional()
  admin?: string
}
