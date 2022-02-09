import { PartialType } from '@nestjs/swagger'
import { IsOptional, IsUUID } from 'class-validator'
import { ExistsInDb } from 'src/pipes/validation/ExistsInDb'
import { PendingTransaction } from 'src/transaction/entities/pending-transaction.entity'
import { PaginateOptions } from 'src/types/Paginated'

export default class GetAllPendingTransactionDto extends PartialType(
  PaginateOptions,
) {
  @ExistsInDb(PendingTransaction, 'caesar_buyer', {
    message: `Caesar has no pending transactions as buyer`,
  })
  @IsOptional()
  @IsUUID()
  caesar_buyer?: string

  @IsOptional()
  @ExistsInDb(PendingTransaction, 'caesar_seller', {
    message: `Caesar has no pending transactions as seller`,
  })
  @IsUUID()
  caesar_seller?: string

  @IsOptional()
  withDeleted?: boolean

  @IsOptional()
  approved?: boolean
}
