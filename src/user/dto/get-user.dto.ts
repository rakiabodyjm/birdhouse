import { Transform } from 'class-transformer'
import { IsOptional } from 'class-validator'

export class GetUserDto {
  @IsOptional()
  @Transform(({ value }) => {
    return !(value === 'false')
  })
  cache?: boolean = true
}
