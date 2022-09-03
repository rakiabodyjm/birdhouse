import { PartialType } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'
import { PaginateOptions } from 'src/types/Paginated'
import { UserTypesAndUser } from 'src/types/Roles'

export class GetAllCaesarDto extends PartialType(PaginateOptions) {
  @IsOptional()
  account_type?: UserTypesAndUser
}
