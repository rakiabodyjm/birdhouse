import { UserTypesAndUser } from 'src/types/Roles'
import { IsOptional } from 'class-validator'
import { PaginateOptions } from 'src/types/Paginated'

export class SearchCaesarDto extends PaginateOptions {
  @IsOptional()
  searchQuery: string

  @IsOptional()
  account_type: UserTypesAndUser
}
