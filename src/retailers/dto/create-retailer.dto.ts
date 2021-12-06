import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsPhoneNumber, IsUUID } from 'class-validator'
import { Dsp } from 'src/dsp/entities/dsp.entity'
import { ExistsInDb } from 'src/pipes/validation/ExistsInDb'
import { NoDuplicateInDb } from 'src/pipes/validation/NoDuplicateInDb'
import { Retailer } from 'src/retailers/entities/retailer.entity'
import { Subdistributor } from 'src/subdistributor/entities/subdistributor.entity'
import { User } from 'src/user/entities/user.entity'
import { Column } from 'typeorm'

export class CreateRetailerDto {
  @ApiProperty()
  @IsNotEmpty()
  @ExistsInDb(Subdistributor, 'id', {
    message: `Subdsitributor Account doesn't exist`,
  })
  subdistributor: Subdistributor

  @ApiProperty()
  @IsNotEmpty()
  @ExistsInDb(Dsp, 'id', {
    message: `Dsp Account doesn't exist `,
  })
  dsp: Dsp

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  @ExistsInDb(User, 'id', {
    message: `User account doesn't exist`,
  })
  @NoDuplicateInDb(Retailer, 'user', {
    message: `User account already linked to Retailer`,
  })
  user: User

  @ApiProperty()
  @IsPhoneNumber('PH', {
    message: `E Bind Number must be PH Phone format`,
  })
  @IsNotEmpty({
    message: `E Bind Number or DITO Phone Number required`,
  })
  @NoDuplicateInDb(Retailer, 'e_bind_number', {
    message: `E Bind Number already used`,
  })
  e_bind_number: string

  @ApiProperty()
  @IsOptional()
  store_name: string

  @ApiProperty()
  @IsNotEmpty({ message: `ID Type required` })
  id_type: string

  @ApiProperty()
  @Column()
  @IsNotEmpty({ message: `ID Number required` })
  id_number: string
}
