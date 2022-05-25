import { IsNumber, IsOptional } from 'class-validator'

export class UpdateCashTransferDto {
  @IsOptional()
  @IsNumber()
  override_interest?: number | null

  @IsOptional()
  created_at?: Date

  @IsOptional()
  message?: string

  @IsOptional()
  description?: string
}
