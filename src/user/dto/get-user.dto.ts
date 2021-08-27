import { ParseBoolPipe } from '@nestjs/common'
import { Transform } from 'class-transformer'
import { IsBoolean, IsBooleanString, IsOptional } from 'class-validator'

export class GetUserDto {
  @IsOptional()
  @Transform(({ value }) => {
    return !(value === 'false')
  })
  cache?: boolean = true
}
