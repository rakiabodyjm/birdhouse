import { PartialType } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'
import { CaesarBank } from 'src/cash-transfer/entities/caesar-bank.entity'
import { ExistsInDb } from 'src/pipes/validation/ExistsInDb'
import { Request } from 'src/request/entities/request.entity'
import { PaginateOptions } from 'src/types/Paginated'
import { OTP } from '../entities/otp.entity'

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
  @ExistsInDb(CaesarBank, 'id', {
    message: `Caesar Bank doesn't exist`,
  })
  caesar_bank?: CaesarBank['id']
}
