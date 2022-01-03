import { PartialType } from '@nestjs/swagger'
import { IsOptional, IsUUID } from 'class-validator'
import { Caesar } from 'src/caesar/entities/caesar.entity'
import { ExistsInDb } from 'src/pipes/validation/ExistsInDb'
import { PaginateOptions } from 'src/types/Paginated'

export default class GetAllPendingTransactionDto extends PartialType(
  PaginateOptions,
) {
  @ExistsInDb(Caesar, 'caesar_buyer', {
    message: `Caesar has no pending transactions as buyer`,
  })
  @IsOptional()
  @IsUUID()
  caesar_buyer?: string

  @IsOptional()
  @ExistsInDb(Caesar, 'caesar_seller', {
    message: `Caesar has no pending transactions as seller`,
  })
  @IsUUID()
  caesar_seller?: string

  @IsOptional()
  withDeleted?: boolean

  @IsOptional()
  approved?: boolean
}
