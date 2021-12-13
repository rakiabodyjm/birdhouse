import { PartialType } from '@nestjs/swagger'
import { CreateCaesarDto } from './create-caesar.dto'

export class UpdateCaesarDto extends PartialType(CreateCaesarDto) {}
