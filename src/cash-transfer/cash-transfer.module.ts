import { Module } from '@nestjs/common'
import { CashTransferService } from './services/cash-transfer.service'
import { CashTransferController } from './controllers/cash-transfer.controller'
import { BankController } from './controllers/bank.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Bank } from 'src/cash-transfer/entities/bank.entity'
import { TransferType } from 'src/cash-transfer/entities/transfer-type.entity'
import { CashTransfer } from 'src/cash-transfer/entities/cash-transfer.entity'
import { CaesarBank } from 'src/cash-transfer/entities/caesar-bank.entity'
import { BankService } from 'src/cash-transfer/services/bank.service'
import { TransferTypeController } from 'src/cash-transfer/controllers/transfer-type.controller'
import { CaesarBankController } from 'src/cash-transfer/controllers/caesar-bank.controller'
import { TransferTypeService } from 'src/cash-transfer/services/transfer-type.service'
import { CaesarBankService } from 'src/cash-transfer/services/caesar-bank.service'
import { CaesarModule } from 'src/caesar/caesar.module'
import { RevertCashTransferController } from './controllers/revert-cash-transfer.controller'
import { RevertCashTransferService } from './services/revert-cash-transfer.service'
@Module({
  imports: [
    CaesarModule,
    TypeOrmModule.forFeature([CashTransfer, Bank, CaesarBank, TransferType]),
  ],
  controllers: [
    BankController,
    TransferTypeController,
    CaesarBankController,
    CashTransferController,
    RevertCashTransferController
  ],
  providers: [
    CashTransferService,
    BankService,
    TransferTypeService,
    CaesarBankService,
    RevertCashTransferService
  ],
  exports: [
    {
      provide: CaesarBankService,
      useClass: CaesarBankService,
    },
    CashTransferService,
    RevertCashTransferService,
    // BankService,
    TransferTypeService,
    // CaesarBankService,
  ],
})
export class CashTransferModule {}
