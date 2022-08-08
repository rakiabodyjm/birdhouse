import { PartialType } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'
import { CaesarBank } from 'src/cash-transfer/entities/caesar-bank.entity'
import { CashTransfer } from 'src/cash-transfer/entities/cash-transfer.entity'
import { OTP } from 'src/otp/entities/otp.entity'
import { ExistsInDb } from 'src/pipes/validation/ExistsInDb'
import { Request } from 'src/request/entities/request.entity'
import { PaginateOptions } from 'src/types/Paginated'

export class GetAllOTPDto extends PartialType(PaginateOptions) {
  @IsOptional()
  searchQuery: string

  @IsOptional()
  @ExistsInDb(OTP, 'id', {
    message: `OTP ID doesn't exist`,
  })
  id?: OTP['id']

  @IsOptional()
  to: string

  @IsOptional()
  from: string

  @IsOptional()
  request_id: string

  @IsOptional()
  @ExistsInDb(Request, 'id', {
    message: `Request doesn't exist`,
  })
  request?: Request['id']

  @IsOptional()
  @ExistsInDb(CashTransfer, 'id', {
    message: `Cash Transfer doesn't exist`,
  })
  cash_transfer?: CashTransfer['id']

  @IsOptional()
  @ExistsInDb(CaesarBank, 'id', {
    message: `Caesar Bank doesn't exist`,
  })
  caesar_bank?: CaesarBank['id']
}
