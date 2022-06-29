import { IsNotEmpty, IsPhoneNumber } from 'class-validator'
import { ExistsInDb } from 'src/pipes/validation/ExistsInDb'
import { NoDuplicateInDb } from 'src/pipes/validation/NoDuplicateInDb'
import { Request } from 'src/request/entities/request.entity'

export class CreateOTPDto {
  @IsNotEmpty({
    message: `Code Length is required`,
  })
  code_length: string

  @IsNotEmpty({
    message: `Sender is required`,
  })
  from: string

  @IsNotEmpty({
    message: `Receiver is required`,
  })
  @IsPhoneNumber()
  to: string

  @IsNotEmpty({
    message: `OTP Expiration Time is required`,
  })
  pin_expire: string

  @ExistsInDb(Request, 'id', {
    message: 'Request not found',
  })
  @NoDuplicateInDb(Request, 'id', {
    message: 'Request Id already used',
  })
  req_ref: any
}
