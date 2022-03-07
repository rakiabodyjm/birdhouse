import { PartialType } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsNotEmpty, IsOptional, MinLength } from 'class-validator'
import { PaginateOptions } from 'src/types/Paginated'

export class SearchCaesarDto extends PaginateOptions {
  @IsOptional()
  @MinLength(1)
  searchQuery: string
}
