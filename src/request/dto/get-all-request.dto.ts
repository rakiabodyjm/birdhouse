import { PartialType } from '@nestjs/swagger'
import { IsOptional, IsEnum } from 'class-validator'
import { CaesarBank } from 'src/cash-transfer/entities/caesar-bank.entity'
import { CashTransfer } from 'src/cash-transfer/entities/cash-transfer.entity'
import { ExistsInDb } from 'src/pipes/validation/ExistsInDb'
import { PaginateOptions } from 'src/types/Paginated'
import { CashTransferAs, Request, Status } from '../entities/request.entity'

export class GetAllRequestDto extends PartialType(PaginateOptions) {
  @IsOptional()
  @ExistsInDb(Request, 'id', {
    message: `Request ID doesn't exist`,
  })
  id?: CashTransfer['id']

  @IsOptional()
  @ExistsInDb(CaesarBank, 'id', {
    message: `Caesar Bank Entity doesn't exist`,
  })
  caesar_bank?: CaesarBank['id']

  @IsEnum(CashTransferAs)
  @IsOptional()
  as: CashTransferAs

  @IsEnum(Status)
  @IsOptional()
  status: Status

  @ExistsInDb(CashTransfer, 'id', {
    message: `Loan doesn't exist`,
  })
  @IsOptional()
  loan?: any
}
