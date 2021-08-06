import { PartialType } from '@nestjs/mapped-types'
import { CreateDspDto } from './create-dsp.dto'

export class UpdateDspDto extends PartialType(CreateDspDto) {}
