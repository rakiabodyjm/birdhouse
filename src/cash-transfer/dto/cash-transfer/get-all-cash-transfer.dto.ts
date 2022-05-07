import { PartialType } from '@nestjs/swagger'
import { IsEnum, IsOptional } from 'class-validator'
import { Caesar } from 'src/caesar/entities/caesar.entity'
import { CaesarBank } from 'src/cash-transfer/entities/caesar-bank.entity'
import {
  CashTransfer,
  CashTransferAs,
} from 'src/cash-transfer/entities/cash-transfer.entity'
import { TransferType } from 'src/cash-transfer/entities/transfer-type.entity'
import { ExistsInDb } from 'src/pipes/validation/ExistsInDb'
import { PaginateOptions } from 'src/types/Paginated'

export class GetAllCashTransferDto extends PartialType(PaginateOptions) {
  @ExistsInDb(Caesar, 'id', {
    message: `Caesar doesn't exist`,
  })
  @IsOptional()
  caesar?: Caesar['id']

  @IsOptional()
  @ExistsInDb(CaesarBank, 'id', {
    message: `Caesar Bank Entity doesn't exist`,
  })
  caesar_bank: CaesarBank['id']

  // @ExistsInDb(TransferType, 'id', {
  //   message: `Transfer Type doesn't exist`,
  // })
  // @IsOptional()
  // transfer_type?: TransferType['id']

  @IsEnum(CashTransferAs)
  @IsOptional()
  as: CashTransferAs

  @ExistsInDb(CaesarBank, 'id', {
    message: `Caesar bank account doesn't exist`,
  })
  @IsOptional()
  caesar_bank_from?: CaesarBank['id']

  @ExistsInDb(CaesarBank, 'id', {
    message: `Caesar bank account doesn't exist`,
  })
  @IsOptional()
  caesar_bank_to?: CaesarBank['id']

  @IsOptional()
  @ExistsInDb(Caesar, 'id', {
    message: `Caesar TO doesn't exist`,
  })
  to?: Caesar['id']

  @IsOptional()
  @ExistsInDb(Caesar, 'id', {
    message: `Caesar FROM doesn't exist`,
  })
  from?: Caesar['id']

  @IsOptional()
  date_from?: Date

  @IsOptional()
  date_to?: Date

  @ExistsInDb(CashTransfer, 'id', {
    message: `Loan doesn't exist`,
  })
  @IsOptional()
  loan?: any
}
