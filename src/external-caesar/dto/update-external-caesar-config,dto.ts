import { CreateExternalCaesarConfigDto } from './create-external-caesar-config.dto'
import { PartialType } from '@nestjs/swagger'

export class UpdateExternalCaesarConfigDto extends PartialType(
  CreateExternalCaesarConfigDto,
) {}
