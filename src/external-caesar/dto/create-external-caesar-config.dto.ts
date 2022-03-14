import { IsNotEmpty } from 'class-validator'

export class CreateExternalCaesarConfigDto {
  @IsNotEmpty()
  peso_rate: string

  @IsNotEmpty()
  dollar_rate: string
}
