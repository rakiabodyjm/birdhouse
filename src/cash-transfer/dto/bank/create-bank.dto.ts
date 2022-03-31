import { IsNotEmpty, IsOptional } from 'class-validator'

export class CreateBankDto {
  @IsNotEmpty()
  name: string

  @IsOptional()
  description: string
}
