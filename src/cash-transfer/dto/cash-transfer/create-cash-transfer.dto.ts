import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  MaxLength,
} from 'class-validator'
import { Caesar } from 'src/caesar/entities/caesar.entity'
import { CaesarBank } from 'src/cash-transfer/entities/caesar-bank.entity'
import { CashTransferAs } from 'src/cash-transfer/entities/cash-transfer.entity'
import { ExistsInDb } from 'src/pipes/validation/ExistsInDb'

export class GenericCashTransfer {
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

  @IsOptional()
  @IsNumber()
  bank_fee: number

  @IsOptional()
  @IsNumber()
  interest: number
}

export class CreateCashTransferDto extends GenericCashTransfer {
  @IsOptional()
  @ExistsInDb(CaesarBank, 'id', {
    message: `LOAN | Caesar bank from doesn't exist `,
  })
  caesar_bank_from: any

  @IsOptional()
  @ExistsInDb(CaesarBank, 'id', {
    message: `LOAN | Caesar bank to doesn't exist`,
  })
  caesar_bank_to: any

  @IsOptional()
  @ExistsInDb(Caesar, 'id', {
    message: `LOAN | Caesar to doesn't exist`,
  })
  to: any

  @IsOptional()
  @ExistsInDb(Caesar, 'id', {
    message: `LOAN | Caesar from doesn't exist`,
  })
  from: any

  @MaxLength(255)
  @IsOptional()
  message: string
}
