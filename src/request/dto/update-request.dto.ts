import { PartialType } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'
import { Status } from '../entities/request.entity'
import { CreateRequestDto } from './create-request.dto'

export class UpdateRequestDto extends PartialType(CreateRequestDto) {
  @IsOptional()
  description?: string

  @IsOptional()
  is_paid?: boolean

  @IsOptional()
  status?: Status
}
