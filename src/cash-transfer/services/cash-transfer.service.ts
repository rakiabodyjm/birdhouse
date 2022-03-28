import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ActualCaesarService } from 'src/actual-caesar/actual-caesar.service'
import { CaesarService } from 'src/caesar/caesar.service'
import { CreateCashTransferDto } from 'src/cash-transfer/dto/cash-transfer/create-cash-transfer.dto'
import { GetAllCashTransferDto } from 'src/cash-transfer/dto/cash-transfer/get-all-cash-transfer.dto'
import { UpdateCashTransferDto } from 'src/cash-transfer/dto/cash-transfer/update-cash-transfer.dto'
import { CashTransfer } from 'src/cash-transfer/entities/cash-transfer.entity'
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
    private caesarService: CaesarService,
    private actualCaesarService: ActualCaesarService,
  ) {}

  async create(createCashTransferDto: CreateCashTransferDto) {
    const { amount, from, to, caesar_bank, transfer_type, message } =
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

    const sendCCoinResult = await this.actualCaesarService.sendCcoin({
      amount,
      caesar_from: caesarFrom.data.wallet_id,
      caesar_to: caesarTo.data.wallet_id,

      message: message || `Cash Transfer from ${from}`,
    })
    console.log('sendCCoinResult', sendCCoinResult)

    const caesarBank = await this.caesarBankService.findOne(caesar_bank)
    const transferType = await this.transferTypeService.findOne(transfer_type)

    const newTransfer = this.cashTransferRepository.create({
      ...createCashTransferDto,
      transfer_type: transferType,
      caesar_bank: caesarBank,
      from: caesarFrom,
      to: caesarTo,
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
}
