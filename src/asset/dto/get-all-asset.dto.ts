import { BadRequestException } from '@nestjs/common'
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
    try {
      if (value) {
        if (value === 'true') {
          return true
        } else if (value === 'false') {
          return false
        } else {
          throw new Error(
            `active parameter must only be of values true or false`,
          )
        }
      } else {
        throw new Error(
          `Value must be either true, false or not defined in parameters`,
        )
      }
    } catch (err) {
      throw new BadRequestException(err.message)
    }
  })
  @IsOptional()
  @IsBoolean()
  withDeleted?: true

  @Transform(({ value }) => {
    try {
      if (value) {
        if (value === 'true') {
          return true
        } else if (value === 'false') {
          return false
        } else {
          throw new Error(
            `active parameter must only be of values true or false`,
          )
        }
      } else {
        throw new Error(
          `Value must be either true, false or not defined in parameters`,
        )
      }
    } catch (err) {
      throw new BadRequestException(err.message)
    }
  })
  @IsOptional()
  @IsBoolean()
  active: boolean
}
