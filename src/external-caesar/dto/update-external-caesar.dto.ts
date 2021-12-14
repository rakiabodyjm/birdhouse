import { PartialType } from '@nestjs/swagger'
import { CreateExternalCaesarDto } from './create-external-caesar.dto'

export class UpdateExternalCaesarDto extends PartialType(
  CreateExternalCaesarDto,
) {}
