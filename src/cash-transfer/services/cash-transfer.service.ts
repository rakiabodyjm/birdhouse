import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CaesarService } from 'src/caesar/caesar.service'
import { Caesar } from 'src/caesar/entities/caesar.entity'
import { CreateCashTransferDto } from 'src/cash-transfer/dto/cash-transfer/create-cash-transfer.dto'
import { GetAllCashTransferDto } from 'src/cash-transfer/dto/cash-transfer/get-all-cash-transfer.dto'
import { UpdateCashTransferDto } from 'src/cash-transfer/dto/cash-transfer/update-cash-transfer.dto'
import { CaesarBank } from 'src/cash-transfer/entities/caesar-bank.entity'
import { CashTransfer } from 'src/cash-transfer/entities/cash-transfer.entity'
import { TransferType } from 'src/cash-transfer/entities/transfer-type.entity'
import { CaesarBankService } from 'src/cash-transfer/services/caesar-bank.service'
import { TransferTypeService } from 'src/cash-transfer/services/transfer-type.service'
import paginateFind from 'src/utils/paginate'
import { LessThan, MoreThan, Repository } from 'typeorm'
// import { CreateCashTransferDto } from './dto/cash-transfer/create-cash-transfer.dto'
// import { UpdateCashTransferDto } from './dto/update-cash-transfer.dto'

@Injectable()
export class CashTransferService {
  constructor(
    @InjectRepository(CashTransfer)
    private cashTransferRepository: Repository<CashTransfer>,
    private caesarBankService: CaesarBankService,
    private transferTypeService: TransferTypeService,
    private caesarService: CaesarService, // private actualCaesarService: ActualCaesarService,
  ) {}

  async create(createCashTransferDto: CreateCashTransferDto) {
    const { amount, from, to, caesar_bank, transfer_type, description } =
      createCashTransferDto
    /**
     * check if balance is sufficient
     */
    const caesarFrom = await this.caesarService.findOne(from)
    const caesarTo = await this.caesarService.findOne(to)
    const isBalanceEnough: boolean = (() => {
      return caesarFrom.data.caesar_coin > amount
    })()
    if (!isBalanceEnough) {
      throw new Error(`Caesar Sender has insuffcient balance`)
    }

    /**
     * proceed with sending
     */

    // const sendCCoinResult = await this.actualCaesarService.sendCcoin({
    //   amount,
    //   caesar_from: caesarFrom.data.wallet_id,
    //   caesar_to: caesarTo.data.wallet_id,

    //   message: message || `Cash Transfer from ${from}`,
    // })
    // console.log('sendCCoinResult', sendCCoinResult)

    const caesarBank = await this.caesarBankService.findOne(caesar_bank)
    const transferType = await this.transferTypeService.findOne(transfer_type)

    const newTransfer = this.cashTransferRepository.create({
      ...createCashTransferDto,
      transfer_type: transferType,
      // caesar_bank: caesarBank,
      from: caesarFrom,
      to: caesarTo,
      description,
    })

    return this.cashTransferRepository.save(newTransfer)
  }

  // private async checkSufficientBalance(
  //   caesarId: string,
  //   amount: number,
  // ): Promise<boolean> {
  //   return (
  //     (await this.caesarService.findOne(caesarId)).data.caesar_coin > amount
  //   )
  // }

  async findAll(getAllCashTransfer: GetAllCashTransferDto) {
    return paginateFind(
      this.cashTransferRepository,
      {
        page: getAllCashTransfer.page,
        limit: getAllCashTransfer.limit,
      },
      {
        where: {
          ...(getAllCashTransfer.caesar_bank && {
            caesar_bank: getAllCashTransfer.caesar_bank,
          }),
          ...(getAllCashTransfer.transfer_type && {
            transfer_type: getAllCashTransfer.transfer_type,
          }),
          ...(getAllCashTransfer.date_from && {
            created_at: MoreThan(getAllCashTransfer.date_from),
          }),
          ...(getAllCashTransfer.date_to && {
            created_at: LessThan(getAllCashTransfer.date_to),
          }),
        },
      },
    )
  }

  findOne(id: number) {
    return this.cashTransferRepository.findOneOrFail(id)
  }

  async update(id: number, updateCashTransferDto: UpdateCashTransferDto) {
    const updateCashTransfer = await this.findOne(id)
    return this.cashTransferRepository.save({
      ...updateCashTransfer,
      ...updateCashTransferDto,
    })
  }

  delete(id: number) {
    return this.cashTransferRepository.delete(id)
    // return `This action removes a #${id} cashTransfer`
  }

  deleteAll() {
    return this.cashTransferRepository.clear()
  }

  async withdraw({
    transfer_type,
    amount,
    caesar_bank_from,
    to,
  }: { transfer_type: TransferType['id']; amount: number } & {
    caesar_bank_from: CaesarBank['id']
    to: Caesar['id']
  }) {
    const transferType = await this.transferTypeService.findOne(transfer_type)
    const caesarTo = await this.caesarService.findOne(to)
    const bankWithDrawal = await this.caesarBankService
      .findOne(caesar_bank_from)
      .then((res) => {
        /**
         * deduct from caesarBankService
         */
        return this.caesarBankService
          .pay(res.id, -amount)
          .then((payResult) => {
            return payResult
          })
          .catch((err) => {
            throw new Error(err.message)
          })
      })
      .catch((err) => {
        throw err
      })

    const cashTransfer: Partial<CashTransfer> = {
      amount: -amount,
      caesar_bank_from: bankWithDrawal,
      transfer_type: transferType,
      to: caesarTo,
    }

    const newCashTransfer = this.cashTransferRepository.create(cashTransfer)
    return this.cashTransferRepository.save(newCashTransfer)
  }

  async deposit({
    caesar_bank_to,
    from,
    transfer_type,
    amount,
  }: {
    caesar_bank_to: CaesarBank['id']
    from: Caesar['id']
    transfer_type: TransferType['id']
    amount: number
  }) {
    const transferType = await this.transferTypeService.findOne(transfer_type)
    const caesarTo = await this.caesarService.findOne(from)
    const bankDeposit = await this.caesarBankService
      .findOne(caesar_bank_to)
      .then((res) => {
        /**
         * deduct from caesarBankService
         */
        return this.caesarBankService
          .pay(res.id, amount)
          .then((payResult) => {
            return payResult
          })
          .catch((err) => {
            throw new Error(err.message)
          })
      })
      .catch((err) => {
        throw err
      })

    const cashTransfer: Partial<CashTransfer> = {
      amount: amount,
      caesar_bank_to: bankDeposit,
      transfer_type: transferType,
      from: caesarTo,
    }

    const newCashTransfer = this.cashTransferRepository.create(cashTransfer)
    return this.cashTransferRepository.save(newCashTransfer)
  }

  async transfer({
    caesar_bank_from,
    caesar_bank_to,
    amount,
    transfer_type,
  }: {
    caesar_bank_from: CaesarBank['id']
    caesar_bank_to: CaesarBank['id']
    amount: number
    transfer_type: TransferType['id']
  }) {
    const transferType = await this.transferTypeService.findOne(transfer_type)

    const caesarBankFrom = await this.caesarBankService.pay(
      caesar_bank_from,
      -amount,
    )

    const caesarBankTo = await this.caesarBankService.pay(
      caesar_bank_to,
      amount,
    )

    const cashTransfer: Partial<CashTransfer> = {
      amount,
      caesar_bank_from: caesarBankFrom,
      caesar_bank_to: caesarBankTo,
      transfer_type: transferType,
    }

    const newCashTransfer = this.cashTransferRepository.create(cashTransfer)
    return this.cashTransferRepository.save(newCashTransfer)
  }
}
