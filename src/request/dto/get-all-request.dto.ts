import { PartialType } from '@nestjs/swagger'
import { IsOptional, IsEnum } from 'class-validator'
import { CaesarBank } from 'src/cash-transfer/entities/caesar-bank.entity'
import { CashTransfer } from 'src/cash-transfer/entities/cash-transfer.entity'
import { ExistsInDb } from 'src/pipes/validation/ExistsInDb'
import { PaginateOptions } from 'src/types/Paginated'
import { CashTransferAs, Request, Status } from '../entities/request.entity'

export class GetAllRequestDto extends PartialType(PaginateOptions) {
  @IsOptional()
  searchQuery: string

  @IsOptional()
  @ExistsInDb(Request, 'id', {
    message: `Request ID doesn't exist`,
  })
  id?: Request['id']

  @IsOptional()
  description: string

  @IsOptional()
  @ExistsInDb(CaesarBank, 'id', {
    message: `Caesar Bank Entity doesn't exist`,
  })
  caesar_bank?: CaesarBank['id']

  @IsOptional()
  amount: number

  @IsEnum(CashTransferAs)
  @IsOptional()
  as: CashTransferAs

  @IsOptional()
  is_declined: boolean

  @ExistsInDb(CashTransfer, 'ref_num', {
    message: `Cash Transfer doesn't exist`,
  })
  @IsOptional()
  ct_ref?: any
}
