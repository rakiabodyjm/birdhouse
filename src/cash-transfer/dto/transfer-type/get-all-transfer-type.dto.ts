import { PartialType } from '@nestjs/swagger'
import { PaginateOptions } from 'src/types/Paginated'

export class GetAllTransferTypeDto extends PartialType(PaginateOptions) {}
