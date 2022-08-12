import { IsOptional } from 'class-validator'

export class UpdateOTPDto {
  @IsOptional()
  request_id?: string

  @IsOptional()
  price?: string

  @IsOptional()
  code?: string

  @IsOptional()
  verified: boolean
}
