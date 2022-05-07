import { CaesarBank } from 'src/cash-transfer/entities/caesar-bank.entity'
import { NoDuplicateInDb } from 'src/pipes/validation/NoDuplicateInDb'
import { Caesar } from 'src/caesar/entities/caesar.entity'
import { Bank } from 'src/cash-transfer/entities/bank.entity'
import { ExistsInDb } from 'src/pipes/validation/ExistsInDb'
import { IsNotEmpty, IsOptional } from 'class-validator'

export class CreateCaesarBankDto {
  @ExistsInDb(Bank, 'id', {
    message: `Bank doesn't exist`,
  })
  bank: any

  @ExistsInDb(Caesar, 'id', {
    message: `Caesar doesn't exist`,
  })
  caesar: any

  @NoDuplicateInDb(CaesarBank, 'description', {
    message: `Caesar's Bank description already exists`,
  })
  @IsNotEmpty()
  description: string

  @IsOptional()
  account_number: string
}
