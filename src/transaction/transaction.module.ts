import { forwardRef, Module } from '@nestjs/common'
import { TransactionService } from './transaction.service'
import { TransactionController } from './transaction.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Transaction } from 'src/transaction/entities/transaction.entity'
import { InventoryModule } from 'src/inventory/inventory.module'
import { CeasarModule } from 'src/ceasar/ceasar.module'
import { AssetModule } from 'src/asset/asset.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    InventoryModule,
    CeasarModule,
    AssetModule,
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
