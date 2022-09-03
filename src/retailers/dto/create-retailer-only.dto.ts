import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsPhoneNumber } from 'class-validator'
import { Dsp } from 'src/dsp/entities/dsp.entity'
import { ExistsInDb } from 'src/pipes/validation/ExistsInDb'
import { NoDuplicateInDb } from 'src/pipes/validation/NoDuplicateInDb'
import { Subdistributor } from 'src/subdistributor/entities/subdistributor.entity'
import { Column } from 'typeorm'
import { Retailer } from '../entities/retailer.entity'

export class CreateRetailerOnlyDto {
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

  // @ApiProperty()
  // @IsNotEmpty()
  // @IsUUID()
  // @ExistsInDb(User, 'id', {
  //   message: `User account doesn't exist`,
  // })
  // @NoDuplicateInDb(Retailer, 'user', {
  //   message: `User account already linked to Retailer`,
  // })
  // user: User

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
  phone_number: string

  @ApiProperty()
  @IsNotEmpty({ message: `First Name required` })
  first_name: string

  @ApiProperty()
  @IsNotEmpty({ message: `Last Name required` })
  last_name: string

  @ApiProperty()
  @Column()
  @IsNotEmpty({ message: `Address required` })
  address: string

  // @ApiProperty()
  // @IsEmail()
  // @Column()
  // @IsNotEmpty({ message: `Email required` })
  // email: string
}
