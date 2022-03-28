import { PartialType } from '@nestjs/swagger'
import { CreateTransferTypeDto } from 'src/cash-transfer/dto/transfer-type/create-transfer-type.dto'

export class UpdateTransferTypeDto extends PartialType(CreateTransferTypeDto) {}
