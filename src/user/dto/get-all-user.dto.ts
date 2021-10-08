import { PartialType } from '@nestjs/mapped-types'
import { PaginateOptions } from 'src/types/Paginated'

export class GetAllUserDto extends PartialType(PaginateOptions) {}
