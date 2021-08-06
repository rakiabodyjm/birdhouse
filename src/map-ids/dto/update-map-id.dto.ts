import { PartialType } from '@nestjs/mapped-types'
import { CreateMapIdDto } from './create-map-id.dto'

export class UpdateMapIdDto extends PartialType(CreateMapIdDto) {}
