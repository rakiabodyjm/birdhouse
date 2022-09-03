import { BadRequestException } from '@nestjs/common'
import { PartialType } from '@nestjs/mapped-types'
import { Transform } from 'class-transformer'
import { IsOptional, IsUUID } from 'class-validator'
import { Admin } from 'src/admin/entities/admin.entity'
import Asset from 'src/asset/entities/asset.entity'
import { Dsp } from 'src/dsp/entities/dsp.entity'
import { ExistsInDb } from 'src/pipes/validation/ExistsInDb'
import { Retailer } from 'src/retailers/entities/retailer.entity'
import { Subdistributor } from 'src/subdistributor/entities/subdistributor.entity'
import { User } from 'src/user/entities/user.entity'
import { PaginateOptions } from '../../types/Paginated'

// export class ForDto {
//   // @IsOptional()
//   @IsIn(Object.keys(SRPRoles))
//   account_type?: string

//   @ExistsInDb(Caesar, 'id', {
//     message: `GetAllInventory for this caesar account doesn't exist `,
//   })
//   caesar: string
// }
export class GetAllInventoryDto extends PartialType(PaginateOptions) {
  @Transform(({ value }) => {
    try {
      if (value) {
        if (value === 'true') {
          return true
        } else if (value === 'false') {
          return false
        } else {
          throw new Error(
            `active parameter must only be of values true or false`,
          )
        }
      } else {
        throw new Error(
          `Value must be either true, false or not defined in parameters`,
        )
      }
    } catch (err) {
      console.error('getAllInventory error', err)
      throw new BadRequestException(err.message)
    }
  })
  @IsOptional()
  active?: boolean

  @IsOptional()
  @ExistsInDb(User, 'id')
  @IsUUID()
  user?: string

  @IsOptional()
  @ExistsInDb(Admin, 'id')
  @IsUUID()
  admin?: string

  @IsOptional()
  @ExistsInDb(Subdistributor, 'id')
  @IsUUID()
  subdistributor?: string

  @IsOptional()
  @ExistsInDb(Dsp, 'id')
  @IsUUID()
  dsp?: string

  @IsOptional()
  @ExistsInDb(Retailer, 'id')
  @IsUUID()
  retailer?: string

  @IsOptional()
  @ExistsInDb(Asset, 'id')
  asset?: string
}
