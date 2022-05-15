import { GenericCashTransfer } from './create-cash-transfer.dto'
import { CaesarBank } from 'src/cash-transfer/entities/caesar-bank.entity'
import { ExistsInDb } from 'src/pipes/validation/ExistsInDb'
import { Caesar } from 'src/caesar/entities/caesar.entity'

export class CreateDepositTransferDto extends GenericCashTransfer {
  @ExistsInDb(Caesar, 'id', {
    message: `LOAN | Caesar from doesn't exist`,
  })
  from: Caesar['id']

  @ExistsInDb(CaesarBank, 'id', {
    message: `LOAN | Caesar bank to doesn't exist`,
  })
  caesar_bank_to: CaesarBank['id']
}
