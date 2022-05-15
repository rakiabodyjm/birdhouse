import { Caesar } from 'src/caesar/entities/caesar.entity'
import { CaesarBank } from 'src/cash-transfer/entities/caesar-bank.entity'
import { Transform } from 'class-transformer'
import { IsNotEmpty, IsOptional, Min, Validate } from 'class-validator'
import { CashTransfer } from 'src/cash-transfer/entities/cash-transfer.entity'
import { ExistsInDb } from 'src/pipes/validation/ExistsInDb'
import { NoDuplicateInDb } from 'src/pipes/validation/NoDuplicateInDb'

export class CreateLoanPaymentDto {
  @ExistsInDb(CashTransfer, 'id', {
    message: `Loan doesn't exist`,
  })
  id: any

  @IsNotEmpty()
  amount: number

  @ExistsInDb(Caesar, 'id', {
    message: `Caesar Account TO not found`,
  })
  @IsOptional()
  to?: Caesar['id']

  @ExistsInDb(CaesarBank, 'id', {
    message: `Caesar Account TO bank doesn't exist`,
  })
  @IsOptional()
  caesar_bank_to?: CaesarBank['id']

  @ExistsInDb(CaesarBank, 'id', {
    message: `Caesar Account FROM bank doesn't exist`,
  })
  @IsOptional()
  caesar_bank_from?: any

  @ExistsInDb(Caesar, 'id', {
    message: `Caesar Account FROM not found`,
  })
  @IsOptional()
  from?: Caesar['id']
}
