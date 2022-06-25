import { PartialType } from '@nestjs/swagger'
import { IsEnum, IsNumber, IsOptional } from 'class-validator'
import { CaesarBank } from 'src/cash-transfer/entities/caesar-bank.entity'
import { CashTransfer } from 'src/cash-transfer/entities/cash-transfer.entity'
import { ExistsInDb } from 'src/pipes/validation/ExistsInDb'
import { CashTransferAs, Status } from '../entities/request.entity'
import { CreateRequestDto } from './create-request.dto'

export class UpdateRequestDto extends PartialType(CreateRequestDto) {
  @IsOptional()
  description?: string

  @IsOptional()
  is_paid?: boolean

  @IsEnum(Status, {
    message: `Status should be PENDING or APPROVED`,
  })
  @IsOptional()
  status?: Status

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
  ct_ref?: string
}
