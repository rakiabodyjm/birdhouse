import { PartialType } from '@nestjs/swagger'
import { CreateCaesarBankDto } from 'src/cash-transfer/dto/caesar-bank/create-caesar-bank.dto'

export class UpdateCaesarBankDto extends PartialType(CreateCaesarBankDto) {}
