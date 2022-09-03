import { Transform } from 'class-transformer'
import { IsNotEmpty, IsNumber } from 'class-validator'
import { ExternalCaesar } from 'src/external-caesar/entities/external-caesar.entity'
import { ExistsInDb } from 'src/pipes/validation/ExistsInDb'

export class TopUpExternalCaesarBodyDto {
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => {
    return Number(value)
  })
  amount: number
}
export class TopUpExternalCaesarParamDto {
  @IsNotEmpty()
  @ExistsInDb(ExternalCaesar, 'wallet_id', {
    message: `Caesar wallet_id doesn't exist`,
  })
  id: string
}
