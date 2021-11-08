import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsNotEmpty, Min } from 'class-validator'
import Asset from 'src/asset/entities/asset.entity'
import { NoDuplicateInDb } from 'src/pipes/validation/NoDuplicateInDb'

export class CreateAssetDto {
  @NoDuplicateInDb(Asset, 'code', {
    message: 'Asset Code already exists',
  })
  @ApiProperty()
  @IsNotEmpty()
  code: string

  @ApiProperty()
  @IsNotEmpty()
  name: string

  @ApiProperty()
  @IsNotEmpty()
  description: string

  @ApiProperty()
  @IsNotEmpty()
  @Min(0.01)
  unit_price: number

  @ApiProperty()
  @IsNotEmpty()
  @Min(0.01)
  srp_for_subd: number

  @ApiProperty()
  @IsNotEmpty()
  @Min(0.01)
  srp_for_dsp: number

  @ApiProperty()
  @IsNotEmpty()
  @Min(0.01)
  srp_for_retailer: number

  @ApiProperty()
  @IsNotEmpty()
  @Min(0.01)
  srp_for_user: number
}
