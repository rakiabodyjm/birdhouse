import { PartialType } from '@nestjs/swagger'
import { PaginateOptions } from 'src/types/Paginated'

export class GetAllInventoryLogDto extends PartialType(PaginateOptions) {}
