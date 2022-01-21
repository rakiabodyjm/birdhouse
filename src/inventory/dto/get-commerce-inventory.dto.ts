import { PartialType } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'
import { Caesar } from 'src/caesar/entities/caesar.entity'
import { ExistsInDb } from 'src/pipes/validation/ExistsInDb'
import { PaginateOptions } from 'src/types/Paginated'

export class GetCommerceInventoryDto extends PartialType(PaginateOptions) {
  @ExistsInDb(Caesar, 'id', {
    message: `Caesar doesn't exist`,
  })
  @IsUUID()
  caesar: string
}
