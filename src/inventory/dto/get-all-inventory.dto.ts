import { PartialType } from '@nestjs/mapped-types'
import { IsBooleanString } from 'class-validator'
import { PaginateOptions } from '../../types/Paginated'

export class GetAllInventoryDto extends PartialType(PaginateOptions) {
  @IsBooleanString()
  disabled?: true
}
