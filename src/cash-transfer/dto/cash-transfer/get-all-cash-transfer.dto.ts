import { PartialType } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'
import { Caesar } from 'src/caesar/entities/caesar.entity'
import { CaesarBank } from 'src/cash-transfer/entities/caesar-bank.entity'
import { TransferType } from 'src/cash-transfer/entities/transfer-type.entity'
import { ExistsInDb } from 'src/pipes/validation/ExistsInDb'
import { PaginateOptions } from 'src/types/Paginated'

export class GetAllCashTransferDto extends PartialType(PaginateOptions) {
  @ExistsInDb(Caesar, 'id', {
    message: `Caesar doesn't exist`,
  })
  @IsOptional()
  caesar?: Caesar['id']

  @ExistsInDb(TransferType, 'id', {
    message: `Transfer Type doesn't exist`,
  })
  @IsOptional()
  transfer_type?: TransferType['id']

  @ExistsInDb(CaesarBank, 'id', {
    message: `Caesar bank account doesn't exist`,
  })
  @IsOptional()
  caesar_bank?: CaesarBank['id']

  @IsOptional()
  date_from?: Date

  @IsOptional()
  date_to?: Date
}
