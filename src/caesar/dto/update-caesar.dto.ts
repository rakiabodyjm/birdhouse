import { PartialType } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsOptional } from 'class-validator'
import { Bcrypt } from 'src/utils/Bcrypt'
// import { Transform } from 'class-transformer'
// import { IsOptional } from 'class-validator'
import { CreateCaesarDto } from './create-caesar.dto'

export class UpdateCaesarDto extends PartialType(CreateCaesarDto) {
  // @IsOptional()
  // banks?: any[]
  // @IsOptional()
  // @Transform(({ value }) => value === 'true' || value === true)
  // operator?: boolean

  @Transform(({ value }) => {
    return Bcrypt().generatePassword(value)
  })
  @IsOptional()
  password?: string
}
