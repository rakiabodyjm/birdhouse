import { IsOptional } from 'class-validator'
import { Caesar } from 'src/caesar/entities/caesar.entity'
import { Bank } from 'src/cash-transfer/entities/bank.entity'
import { ExistsInDb } from 'src/pipes/validation/ExistsInDb'

export class CreateCaesarBankDto {
  @ExistsInDb(Bank, 'id', {
    message: `Bank doesn't exist`,
  })
  bank: any

  @ExistsInDb(Caesar, 'id', {
    message: `Caesar doesn't exist`,
  })
  caesar: any

  @IsOptional()
  description: string
}
