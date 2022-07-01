import { IsNotEmpty } from 'class-validator'
import { CaesarBank } from 'src/cash-transfer/entities/caesar-bank.entity'
import { ExistsInDb } from 'src/pipes/validation/ExistsInDb'
import { NoDuplicateInDb } from 'src/pipes/validation/NoDuplicateInDb'
import { Request } from 'src/request/entities/request.entity'
import { OTP } from '../entities/otp.entity'

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
  to: string

  @IsNotEmpty({
    message: `OTP Expiration Time is required`,
  })
  pin_expire: string

  @ExistsInDb(Request, 'id', {
    message: 'Request not found',
  })
  @NoDuplicateInDb(OTP, 'request', {
    message: 'Request Id already used',
  })
  request: any

  @IsNotEmpty({
    message: `Caesar bank should not be empty`,
  })
  @ExistsInDb(CaesarBank, 'id', {
    message: `Caesar bank from doesn't exist `,
  })
  caesar_bank: any
}
