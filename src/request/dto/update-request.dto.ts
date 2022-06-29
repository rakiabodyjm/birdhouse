import { PartialType } from '@nestjs/swagger'
import { IsEnum, IsNumber, IsOptional } from 'class-validator'
import { CaesarBank } from 'src/cash-transfer/entities/caesar-bank.entity'
import { CashTransfer } from 'src/cash-transfer/entities/cash-transfer.entity'
import { ExistsInDb } from 'src/pipes/validation/ExistsInDb'
import { NoDuplicateInDb } from 'src/pipes/validation/NoDuplicateInDb'
import { CashTransferAs, Request } from '../entities/request.entity'
import { CreateRequestDto } from './create-request.dto'

export class UpdateRequestDto extends PartialType(CreateRequestDto) {
  @IsOptional()
  description?: string

  @IsOptional()
  is_declined?: boolean

  @IsOptional()
  @IsEnum(CashTransferAs, {
    message: `Transaction Type AS required`,
  })
  as: CashTransferAs

  @IsOptional()
  @ExistsInDb(CaesarBank, 'id', {
    message: `Caesar bank from doesn't exist `,
  })
  caesar_bank: any

  @IsOptional()
  @IsNumber()
  amount: number

  @IsOptional()
  @ExistsInDb(CashTransfer, 'ref_num', {
    message: `Cash Transfer from doesn't exist `,
  })
  @NoDuplicateInDb(Request, 'ct_ref', {
    message: 'Cash Transfer Reference Number already used',
  })
  ct_ref?: string
}
