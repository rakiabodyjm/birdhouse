import { ApiProperty, PartialType } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsArray, IsOptional } from 'class-validator'
import { CreateAssetDto } from './create-asset.dto'

export class UpdateAssetDto extends PartialType(CreateAssetDto) {
  @ApiProperty({
    type: 'string[]',
  })
  @IsOptional()
  @Transform(({ value }) => {
    return Array.isArray(value)
      ? Array.length > 0
        ? JSON.stringify(value)
        : null
      : value
  })
  approval: string[]
}
