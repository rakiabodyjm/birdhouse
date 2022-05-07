import { PartialType } from '@nestjs/swagger'
import { CreateBankDto } from 'src/cash-transfer/dto/bank/create-bank.dto'

export class UpdateBankDto extends PartialType(CreateBankDto) {}
