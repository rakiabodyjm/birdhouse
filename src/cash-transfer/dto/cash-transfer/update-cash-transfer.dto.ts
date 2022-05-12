import { PartialType } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'
import { CreateCashTransferDto } from './create-cash-transfer.dto'

export class UpdateCashTransferDto {
  @IsOptional()
  override_interest?: number

  @IsOptional()
  created_at: string
}
