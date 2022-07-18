import { IsNumber, IsOptional } from 'class-validator'
import { CashTransferAs } from 'src/cash-transfer/entities/cash-transfer.entity'

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

  @IsOptional()
  is_loan_paid?: boolean

  @IsOptional()
  as?: CashTransferAs
}
