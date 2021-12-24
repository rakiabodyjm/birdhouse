import { PartialType } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional } from 'class-validator'
import { PaginateOptions } from 'src/types/Paginated'

export class SearchCaesarDto extends PaginateOptions {
  @IsOptional()
  searchQuery: string
}
