import { forwardRef, Module } from '@nestjs/common'
import { TransactionService } from './transaction.service'
import { TransactionController } from './transaction.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Transaction } from 'src/transaction/entities/transaction.entity'
import { InventoryModule } from 'src/inventory/inventory.module'
import { CeasarModule } from 'src/ceasar/ceasar.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    InventoryModule,
    CeasarModule,
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
