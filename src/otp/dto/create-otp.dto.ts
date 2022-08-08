import { IsNotEmpty, IsOptional } from 'class-validator'
import { CaesarBank } from 'src/cash-transfer/entities/caesar-bank.entity'
import { CashTransfer } from 'src/cash-transfer/entities/cash-transfer.entity'
import { ExistsInDb } from 'src/pipes/validation/ExistsInDb'
import { NoDuplicateInDb } from 'src/pipes/validation/NoDuplicateInDb'
import { Request } from 'src/request/entities/request.entity'
import { OTP } from '../entities/otp.entity'

export class CreateOTPDto {
  @IsOptional()
  from?: string

  @IsNotEmpty({
    message: `Receiver is required`,
  })
  to: string

  @IsOptional()
  @ExistsInDb(CashTransfer, 'id', {
    message: 'Transaction not found',
  })
  @NoDuplicateInDb(OTP, 'cash_transfer', {
    message: 'Transaction Id already used',
  })
  cash_transfer?: any

  @IsOptional()
  @ExistsInDb(Request, 'id', {
    message: 'Request not found',
  })
  // @NoDuplicateInDb(OTP, 'request', {
  //   message: 'Request Id already used',
  // })
  request?: any

  @IsOptional()
  @ExistsInDb(CaesarBank, 'id', {
    message: `Caesar bank from doesn't exist `,
  })
  caesar_bank?: any
}
