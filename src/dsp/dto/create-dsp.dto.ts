import {
  IsArray,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsUUID,
} from 'class-validator'
import { Dsp } from 'src/dsp/entities/dsp.entity'
import { ExistsInDb } from 'src/pipes/validation/ExistsInDb'
import { NoDuplicateInDb } from 'src/pipes/validation/NoDuplicateInDb'
import { MapId } from 'src/map-ids/entities/map-id.entity'
import { User } from 'src/user/entities/user.entity'
import { ApiProperty } from '@nestjs/swagger'
import { Subdistributor } from 'src/subdistributor/entities/subdistributor.entity'
export class CreateDspDto {
  @ApiProperty()
  @IsNotEmpty({
    message: 'E-Bind Number should not be empty',
  })
  @IsPhoneNumber('PH', {
    message: 'E-Bind Number invalid',
  })
  @NoDuplicateInDb(Dsp, 'e_bind_number', {
    message: `E Bind Number already used`,
  })
  e_bind_number: string

  @ApiProperty({
    required: true,
    type: 'string',
  })
  @IsNotEmpty()
  @IsArray({
    message: 'Area ID must be of array format',
  })
  // area_ids: string
  @ExistsInDb(MapId, 'area_id', {
    message: `One or more of the area_id's does not exist`,
  })
  area_id: string[]

  @ApiProperty()
  @IsNotEmpty({
    message: `DSP Code should not be empty`,
  })
  @IsString()
  @NoDuplicateInDb(Dsp, 'dsp_code', {
    message: 'DSP Code already exists',
  })
  dsp_code: string

  @IsUUID()
  @IsString()
  @ExistsInDb(Subdistributor, 'id', {
    message: `Subdistributor ID doesn't exist`,
  })
  @IsNotEmpty({
    message: 'Subdistributor ID is Required',
  })
  subdistributor: Subdistributor

  @ApiProperty()
  @ExistsInDb(User, 'id', {
    message: 'User ID does not exist',
  })
  @NoDuplicateInDb(Dsp, 'user_id')
  @IsNotEmpty()
  @IsUUID()
  user: User
}
