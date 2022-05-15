import { Module } from '@nestjs/common'
import { CashTransferService } from './services/cash-transfer.service'
import { CashTransferController } from './controllers/cash-transfer.controller'
import { BankController } from './controllers/bank.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Bank } from 'src/cash-transfer/entities/bank.entity'
import { CashTransfer } from 'src/cash-transfer/entities/cash-transfer.entity'
import { CaesarBank } from 'src/cash-transfer/entities/caesar-bank.entity'
import { BankService } from 'src/cash-transfer/services/bank.service'
import { CaesarBankController } from 'src/cash-transfer/controllers/caesar-bank.controller'
import { CaesarBankService } from 'src/cash-transfer/services/caesar-bank.service'
import { CaesarModule } from 'src/caesar/caesar.module'
import { RevertCashTransferController } from './controllers/revert-cash-transfer.controller'
import { RevertCashTransferService } from './services/revert-cash-transfer.service'
import { RevertCashTransfer } from 'src/cash-transfer/entities/revert-cash-transfer.entity'
@Module({
  imports: [
    CaesarModule,
    TypeOrmModule.forFeature([
      CashTransfer,
      Bank,
      CaesarBank,
      RevertCashTransfer,
    ]),
  ],
  controllers: [
    BankController,
    CaesarBankController,
    RevertCashTransferController,
    CashTransferController,
  ],
  providers: [
    CashTransferService,
    BankService,
    RevertCashTransferService,
    CaesarBankService,
  ],
  exports: [
    {
      provide: CaesarBankService,
      useClass: CaesarBankService,
    },
    CashTransferService,
    RevertCashTransferService,
    // BankService,
    // CaesarBankService,
  ],
})
export class CashTransferModule {}
