import { ApiProperty } from '@nestjs/swagger'
import {
  IsNotEmpty,
  IsNumberString,
  IsPhoneNumber,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator'
import { MapId } from 'src/map-ids/entities/map-id.entity'
import { ExistsInDb } from 'src/pipes/validation/ExistsInDb'
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
  @NoDuplicateInDb(Subdistributor, 'e_bind_number', {
    message: `E Bind Number Already used`,
  })
  e_bind_number: string

  @ApiProperty()
  @IsNotEmpty({
    message: `ID Number missing`,
  })
  id_number: string

  @MinLength(3)
  @ApiProperty()
  @IsNotEmpty({
    message: `ID Type missing`,
  })
  id_type: string

  @ExistsInDb(MapId, 'area_id', {
    message: "Area ID doesn't exist",
  })
  @NoDuplicateInDb(Subdistributor, 'area_id', {
    message: `Area ID already used by another Subdistributor`,
  })
  @ApiProperty({
    type: 'string',
    required: true,
  })
  @IsNotEmpty({
    message: 'Area ID Required',
  })
  area_id: string

  @IsNumberString(
    {
      no_symbols: true,
    },
    {
      message: 'Invalid ZIP Code | Numbers only',
    },
  )
  @ApiProperty({
    type: 'string',
  })
  zip_code: string

  @NoDuplicateInDb(Subdistributor, 'user', {
    message: 'User account already used by another Subdistributor Account',
  })
  @ExistsInDb(User, 'id', {
    message: `User dodesn't exist`,
  })
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  user: User

  @NoDuplicateInDb(Subdistributor, 'name')
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(26)
  @MinLength(3)
  name: string
}
