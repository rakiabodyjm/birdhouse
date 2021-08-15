import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'

export type Paginated<T> = {
  data: T[]
  metadata: {
    /**
     *  Total number of pages with limitations set
     */
    total_page: number
    /**
     * Current page
     */
    page: number
    /**
     * Number of entities per page
     */
    limit: number
    /**
     * Total number of entities
     */
    total: number
  }
}

export class PaginateOptions {
  @ApiProperty()
  @Transform((params) => {
    return Number(params.value)
  })
  page?: number
  @ApiProperty()
  @Transform(({ value }) => Number(value))
  limit?: number
}
