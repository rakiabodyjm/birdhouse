import { PartialType } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'
import { PaginateOptions } from 'src/types/Paginated'

export class GetAllBankDto extends PartialType(PaginateOptions) {
  @IsOptional()
  search?: string
}
