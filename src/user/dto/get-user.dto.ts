import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsOptional } from 'class-validator'

export class GetUserDto {
  @ApiProperty()
  @IsOptional()
  @Transform(({ value }) => {
    return !(value === 'false')
  })
  cache?: boolean = true
}
