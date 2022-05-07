import { PartialType } from '@nestjs/swagger'
import { CreateCashTransferDto } from './create-cash-transfer.dto'

export class UpdateCashTransferDto extends PartialType(CreateCashTransferDto) {}
