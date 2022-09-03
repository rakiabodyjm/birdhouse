import { Module } from '@nestjs/common'
import { TransactionService } from './transaction.service'
import { TransactionController } from './transaction.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Transaction } from 'src/transaction/entities/transaction.entity'
import { InventoryModule } from 'src/inventory/inventory.module'
import { CaesarModule } from 'src/caesar/caesar.module'
import { AssetModule } from 'src/asset/asset.module'
import PendingTransactionController from 'src/transaction/pending-transaction.controller'
import { PendingTransaction } from 'src/transaction/entities/pending-transaction.entity'
import { PendingTransactionService } from 'src/transaction/pending-transaction.service'
import { DspModule } from 'src/dsp/dsp.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, PendingTransaction]),
    InventoryModule,
    CaesarModule,
    AssetModule,
    DspModule,
  ],
  controllers: [TransactionController, PendingTransactionController],
  providers: [PendingTransactionService, TransactionService],
  exports: [TransactionService, PendingTransactionService],
})
export class TransactionModule {}

// @Module({
//   imports: [TypeOrmModule.forFeature([PendingTransaction]), TransactionModule],
//   providers: [PendingTransactionService],
// })
// export class PendingTranactionModule {}
