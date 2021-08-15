import { PartialType } from '@nestjs/mapped-types'
import {
  IsNotEmpty,
  IsNumber,
  IsPhoneNumber,
  IsString,
  IsUUID,
} from 'class-validator'
import { Dsp } from 'src/dsp/entities/dsp.entity'
import { ExistsInDb } from 'src/pipes/validation/ExistsInDb'
import { NoDuplicateInDb } from 'src/pipes/validation/NoDuplicateInDb'
import { MapId } from 'src/map-ids/entities/map-id.entity'
import { CreateUserDto } from 'src/user/dto/create-user.dto'
import { User } from 'src/user/entities/user.entity'

export class CreateDspDto extends PartialType(CreateUserDto) {
  @IsNotEmpty({
    message: 'E-Bind Number should not be empty',
  })
  @IsPhoneNumber('PH', {
    message: 'E-Bind Number invalid',
  })
  e_bind_number: string

  @ExistsInDb(MapId, 'area_id', {
    message: 'Area ID does not exist',
  })
  @IsNotEmpty()
  @IsNumber({}, { message: 'Invalid Area ID format' })
  area_id: MapId

  @IsString()
  @NoDuplicateInDb(Dsp, 'dsp_code', {
    message: 'DSP Code already exists',
  })
  dsp_code: string

  @ExistsInDb(User, 'id', {
    message: 'User ID does not exist',
  })
  @IsNotEmpty()
  @IsUUID()
  user: User
}
