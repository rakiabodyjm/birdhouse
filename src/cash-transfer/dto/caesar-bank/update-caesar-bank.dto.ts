import { Caesar } from 'src/caesar/entities/caesar.entity'
import { Bank } from 'src/cash-transfer/entities/bank.entity'
import { IsOptional } from 'class-validator'
import { ExistsInDb } from 'src/pipes/validation/ExistsInDb'

export class UpdateCaesarBankDto {
  @IsOptional()
  @ExistsInDb(Bank, 'id', {
    message: `Bank doesn't exist`,
  })
  bank?: any

  @IsOptional()
  @ExistsInDb(Caesar, 'id', {
    message: `Caesar doesn't exist`,
  })
  caesar?: any
}
