import { ApiProperty } from '@nestjs/swagger'
import {
  IsNotEmpty,
  IsNumberString,
  IsPhoneNumber,
  IsUUID,
} from 'class-validator'
import { MapId } from 'src/map-ids/entities/map-id.entity'
import { NoDuplicateInDb } from 'src/pipes/validation/NoDuplicateInDb'
import { Subdistributor } from 'src/subdistributor/entities/subdistributor.entity'
import { User } from 'src/user/entities/user.entity'

export class CreateSubdistributorDto {
  @ApiProperty()
  @IsNumberString(
    { no_symbols: false },
    {
      message: `Invalid e_bind_number format`,
    },
  )
  @IsPhoneNumber('PH')
  e_bind_number: string

  @ApiProperty()
  @IsNotEmpty({
    message: `Invalid Certificate / ID Number`,
  })
  id_number: string

  @ApiProperty({
    type: 'string',
    required: true,
  })
  map_id: MapId

  @IsNumberString(
    {
      no_symbols: true,
    },
    {
      message: 'Invalid ZIP Code | Numbers only',
    },
  )
  @ApiProperty()
  zip_code: string
  @NoDuplicateInDb(Subdistributor, 'user', {
    message: 'User account already used by another Subdistributor Account',
  })
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  user?: User
}
