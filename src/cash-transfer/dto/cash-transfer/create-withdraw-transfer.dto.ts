import { CaesarBank } from 'src/cash-transfer/entities/caesar-bank.entity'
import { Caesar } from 'src/caesar/entities/caesar.entity'
import { ExistsInDb } from 'src/pipes/validation/ExistsInDb'
import { GenericCashTransfer } from './create-cash-transfer.dto'
export class CreateWithdrawTransferDto extends GenericCashTransfer {
  @ExistsInDb(Caesar, 'id', {
    message: `Caesar Doesn't exist`,
  })
  to: any

  @ExistsInDb(CaesarBank, 'id', {
    message: `Caesar's bank Account TO doesn't exist`,
  })
  caesar_bank_from: any
}
