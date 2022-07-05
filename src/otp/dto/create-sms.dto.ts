import { IsNotEmpty } from 'class-validator'
import { CashTransfer } from 'src/cash-transfer/entities/cash-transfer.entity'
import { ExistsInDb } from 'src/pipes/validation/ExistsInDb'
import { NoDuplicateInDb } from 'src/pipes/validation/NoDuplicateInDb'
import { Request } from 'src/request/entities/request.entity'

export class CreateSMSDto {
  @IsNotEmpty({
    message: `Sender is required`,
  })
  from: string

  @IsNotEmpty({
    message: `Receiver is required`,
  })
  to: string

  @ExistsInDb(Request, 'id', {
    message: 'Request not found',
  })
  @NoDuplicateInDb(Request, 'request', {
    message: 'Request Id already used',
  })
  request: any

  @IsNotEmpty({
    message: `Cash Transfer should not be empty`,
  })
  @ExistsInDb(CashTransfer, 'ref_num', {
    message: `Cash Transfer from doesn't exist `,
  })
  ct_ref: any
}
