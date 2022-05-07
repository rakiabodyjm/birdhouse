import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator'
import { Caesar } from 'src/caesar/entities/caesar.entity'
import { ExistsInDb } from 'src/pipes/validation/ExistsInDb'

export class SendCCoinDto {
  @ExistsInDb(Caesar, `id`, {
    message: `Caesar Doesn't exist`,
  })
  caesar_from: string

  @ExistsInDb(Caesar, `id`, {
    message: `Caesar Doesn't exist`,
  })
  caesar_to: string

  @IsNotEmpty()
  amount: number

  @IsOptional()
  @MaxLength(255)
  message: string
}
