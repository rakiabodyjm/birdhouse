import { PartialType } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'
import { Caesar } from 'src/caesar/entities/caesar.entity'
import { Bank } from 'src/cash-transfer/entities/bank.entity'
import { ExistsInDb } from 'src/pipes/validation/ExistsInDb'
import { PaginateOptions } from 'src/types/Paginated'

export class GetAllCaesarBankDto extends PartialType(PaginateOptions) {
  @ExistsInDb(Caesar, 'id', {
    message: `Caesar doesn't exist`,
  })
  @IsOptional()
  caesar: string

  @ExistsInDb(Bank, 'id', {
    message: `Bank doesn't exist`,
  })
  @IsOptional()
  bank?: string
}
