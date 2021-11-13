import { Controller, Post, Body, Param } from '@nestjs/common'
import { TransactionService } from './transaction.service'
import {
  PurchaseFromInventoryDto,
  PurchaseTransactionDto,
} from 'src/transaction/dto/purchase-transaction.dto'

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('purchase/:id')
  purchase(
    @Param() id: PurchaseFromInventoryDto,
    @Body() purchaseBody: PurchaseTransactionDto,
  ) {
    return id
  }
}
