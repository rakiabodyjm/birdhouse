import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator'

export class UpdateInventoryDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  @IsOptional()
  quantity: number

  @ApiProperty()
  @IsNotEmpty()
  @IsOptional()
  name: string

  @ApiProperty()
  @IsNotEmpty()
  @IsOptional()
  description: string

  @ApiProperty()
  @IsNotEmpty()
  @IsOptional()
  @Min(0.01)
  unit_price: number

  @ApiProperty()
  @IsNotEmpty()
  @IsOptional()
  @Min(0.01)
  srp_for_subd: number

  @ApiProperty()
  @IsNotEmpty()
  @IsOptional()
  @Min(0.01)
  srp_for_dsp: number

  @ApiProperty()
  @IsNotEmpty()
  @IsOptional()
  @Min(0.01)
  srp_for_retailer: number

  @ApiProperty()
  @IsNotEmpty()
  @IsOptional()
  @Min(0.01)
  srp_for_user: number
}
