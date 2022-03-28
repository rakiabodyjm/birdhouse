import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator'

export class CreateTransferTypeDto {
  @IsNotEmpty()
  @MaxLength(255)
  name: string

  @IsOptional()
  description: string
}
