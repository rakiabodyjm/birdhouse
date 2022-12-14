import { GenericCashTransfer } from './create-cash-transfer.dto'
import { Caesar } from 'src/caesar/entities/caesar.entity'
import { CaesarBank } from 'src/cash-transfer/entities/caesar-bank.entity'
import { ExistsInDb } from 'src/pipes/validation/ExistsInDb'
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
  ValidateIf,
} from 'class-validator'

export class CreateLoanTransferDto extends GenericCashTransfer {
  @IsOptional()
  @ValidateIf((o) => !o.from || o.caesar_bank_from)
  @ExistsInDb(CaesarBank, 'id', {
    message: `LOAN | Caesar bank from doesn't exist `,
  })
  caesar_bank_from: any

  @IsOptional()
  @ValidateIf((o) => !o.to || o.caesar_bank_to)
  @ExistsInDb(CaesarBank, 'id', {
    message: `LOAN | Caesar bank to doesn't exist`,
  })
  caesar_bank_to: any

  @IsOptional()
  @ValidateIf((o) => !o.caesar_bank_to || o.to)
  @ExistsInDb(Caesar, 'id', {
    message: `LOAN | Caesar to doesn't exist`,
  })
  to: any

  @IsOptional()
  @ValidateIf((o) => !o.caesar_bank_from || o.from, {
    message: `caesar_bank_from already exists, remove from field`,
  })
  @ExistsInDb(Caesar, 'id', {
    message: `LOAN | Caesar from doesn't exist`,
  })
  from: any

  @IsNumber()
  @IsNotEmpty()
  @Min(1, {
    message: `Must be at least 1 Peso`,
  })
  amount: number
}
