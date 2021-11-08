import { HttpException, HttpStatus } from '@nestjs/common'
import { ApiProperty, PartialType } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsBoolean, IsOptional } from 'class-validator'
import { PaginateOptions } from 'src/types/Paginated'

export class GetAllAssetDto extends PartialType(PaginateOptions) {
  @ApiProperty()
  @IsOptional()
  id: string
  @ApiProperty()
  @IsOptional()
  code: string

  @ApiProperty()
  @IsOptional()
  name: string

  @ApiProperty()
  @IsOptional()
  description: string

  @Transform(({ value }) => {
    if (!['true', 'false'].includes(value)) {
      throw new HttpException(
        `Invalid boolean value for countOnly`,
        HttpStatus.BAD_REQUEST,
      )
    }

    if (value === 'true') {
      return true
    } else {
      return false
    }
  })
  @IsBoolean()
  @IsOptional()
  active: boolean
}
