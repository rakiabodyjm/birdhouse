import { CaesarBank } from './../../entities/caesar-bank.entity'
import { NoDuplicateInDb } from 'src/pipes/validation/NoDuplicateInDb'
import { PartialType } from '@nestjs/swagger'
import { CreateCaesarBankDto } from './create-caesar-bank.dto'
import { Caesar } from 'src/caesar/entities/caesar.entity'
import { Bank } from 'src/cash-transfer/entities/bank.entity'
import { IsOptional } from 'class-validator'
import { ExistsInDb } from 'src/pipes/validation/ExistsInDb'

export class UpdateCaesarBankDto extends PartialType(CreateCaesarBankDto) {
  @ExistsInDb(Bank, 'id', {
    message: `Bank doesn't exist`,
  })
  @IsOptional()
  bank?: any

  @ExistsInDb(Caesar, 'id', {
    message: `Caesar doesn't exist`,
  })
  @IsOptional()
  caesar?: any

  @NoDuplicateInDb(CaesarBank, 'description', {
    message: `Caesar's Bank description already exists`,
  })
  @IsOptional()
  description?: string

  @IsOptional()
  balance: number
}
