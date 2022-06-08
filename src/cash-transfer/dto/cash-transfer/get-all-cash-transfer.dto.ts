import { PartialType } from '@nestjs/swagger'
import { IsEnum, IsIn, IsOptional } from 'class-validator'
import { Caesar } from 'src/caesar/entities/caesar.entity'
import { CaesarBank } from 'src/cash-transfer/entities/caesar-bank.entity'
import {
  CashTransfer,
  CashTransferAs,
} from 'src/cash-transfer/entities/cash-transfer.entity'
import { ExistsInDb } from 'src/pipes/validation/ExistsInDb'
import { PaginateOptions } from 'src/types/Paginated'
import { RolesArray } from 'src/types/Roles'

export class GetAllCashTransferDto extends PartialType(PaginateOptions) {
  @ExistsInDb(Caesar, 'id', {
    message: `Caesar doesn't exist`,
  })
  @IsOptional()
  caesar?: Caesar['id']

  @IsOptional()
  @ExistsInDb(CashTransfer, 'id', {
    message: `CashTransfer doesn't exist`,
  })
  id?: CashTransfer['id']

  @IsOptional()
  @ExistsInDb(CaesarBank, 'id', {
    message: `Caesar Bank Entity doesn't exist`,
  })
  caesar_bank?: CaesarBank['id']

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
  ref_num?: CashTransfer['ref_num']

  @IsOptional()
  date_to?: Date

  @ExistsInDb(CashTransfer, 'id', {
    message: `Loan doesn't exist`,
  })
  @IsOptional()
  loan?: any

  @IsIn([...RolesArray, 'user'])
  @IsOptional()
  account_type?: Caesar['account_type']
}
