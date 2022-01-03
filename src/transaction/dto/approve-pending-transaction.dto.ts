import { IsNotEmpty } from 'class-validator'
import { ExistsInDb } from 'src/pipes/validation/ExistsInDb'
import { PendingTransaction } from 'src/transaction/entities/pending-transaction.entity'

export class ApprovePendingTransactionDto {
  @IsNotEmpty()
  @ExistsInDb(PendingTransaction, 'id')
  id: string
}
