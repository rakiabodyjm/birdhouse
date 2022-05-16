import { PartialType } from '@nestjs/swagger'
import { IsNumber, IsOptional } from 'class-validator'
import { CreateCashTransferDto } from './create-cash-transfer.dto'

export class UpdateCashTransferDto {
  @IsOptional()
  @IsNumber()
  override_interest?: number | null

  @IsOptional()
  created_at: string
}
