import { Caesar } from 'src/caesar/entities/caesar.entity'
import { CaesarBank } from 'src/cash-transfer/entities/caesar-bank.entity'
import { Transform } from 'class-transformer'
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
  Validate,
  ValidateIf,
} from 'class-validator'
import { CashTransfer } from 'src/cash-transfer/entities/cash-transfer.entity'
import { ExistsInDb } from 'src/pipes/validation/ExistsInDb'
import { NoDuplicateInDb } from 'src/pipes/validation/NoDuplicateInDb'

export class CreateLoanPaymentDto {
  @ExistsInDb(CashTransfer, 'id', {
    message: `Loan doesn't exist`,
  })
  id: any

  @IsNotEmpty()
  @IsNumber()
  amount: number

  @ExistsInDb(Caesar, 'id', {
    message: `Caesar Account TO not found`,
  })
  @ValidateIf((o) => !o.caesar_bank_to || o.to)
  @IsOptional()
  to?: Caesar['id']

  @ExistsInDb(CaesarBank, 'id', {
    message: `Caesar Account TO bank doesn't exist`,
  })
  @ValidateIf((o) => !o.to || o.caesar_bank_to)
  @IsOptional()
  caesar_bank_to?: CaesarBank['id']

  @ExistsInDb(CaesarBank, 'id', {
    message: `Caesar Account FROM bank doesn't exist`,
  })
  @ValidateIf((o) => !o.from || o.caesar_bank_from)
  @IsOptional()
  caesar_bank_from?: CaesarBank['id']

  @ExistsInDb(Caesar, 'id', {
    message: `Caesar Account FROM not found`,
  })
  @ValidateIf((o) => !o.caesar_bank_from || o.from)
  @IsOptional()
  from?: Caesar['id']
}
