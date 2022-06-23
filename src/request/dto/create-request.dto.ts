import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator'
import { CaesarBank } from 'src/cash-transfer/entities/caesar-bank.entity'
import { ExistsInDb } from 'src/pipes/validation/ExistsInDb'
import { CashTransferAs } from '../entities/request.entity'

export class CreateRequestDto {
  @IsNotEmpty({
    message: `Amount is required`,
  })
  @IsNumber()
  amount: number

  @IsOptional()
  description: string

  @IsEnum(CashTransferAs, {
    message: `Transaction Type AS required`,
  })
  @IsNotEmpty({
    message: `Transaction Type AS should not be empty`,
  })
  as: CashTransferAs

  @IsNotEmpty({
    message: `Caesar bank should not be empty`,
  })
  @ExistsInDb(CaesarBank, 'id', {
    message: `Caesar bank from doesn't exist `,
  })
  caesar_bank: any
}
