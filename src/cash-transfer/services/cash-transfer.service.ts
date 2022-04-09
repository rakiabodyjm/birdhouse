import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CaesarService } from 'src/caesar/caesar.service'
import { Caesar } from 'src/caesar/entities/caesar.entity'
import { CreateCashTransferDto } from 'src/cash-transfer/dto/cash-transfer/create-cash-transfer.dto'
import { GetAllCashTransferDto } from 'src/cash-transfer/dto/cash-transfer/get-all-cash-transfer.dto'
import { UpdateCashTransferDto } from 'src/cash-transfer/dto/cash-transfer/update-cash-transfer.dto'
import { CaesarBank } from 'src/cash-transfer/entities/caesar-bank.entity'
import {
  CashTransfer,
  CashTransferAs,
} from 'src/cash-transfer/entities/cash-transfer.entity'
import { TransferType } from 'src/cash-transfer/entities/transfer-type.entity'
import { CaesarBankService } from 'src/cash-transfer/services/caesar-bank.service'
import { TransferTypeService } from 'src/cash-transfer/services/transfer-type.service'
import paginateFind from 'src/utils/paginate'
import { LessThan, MoreThan, Repository } from 'typeorm'
import { plainToInstance } from 'class-transformer'
import { CreateLoanPaymentDto } from 'src/cash-transfer/dto/cash-transfer/create-loan-payment.dto'

@Injectable()
export class CashTransferService {
  constructor(
    @InjectRepository(CashTransfer)
    private cashTransferRepository: Repository<CashTransfer>,
    private caesarBankService: CaesarBankService,
    private transferTypeService: TransferTypeService,
    private caesarService: CaesarService, // private actualCaesarService: ActualCaesarService,
    @InjectRepository(TransferType)
    private transferTypeRepository: Repository<TransferType>,
  ) {}

  relations = ['from', 'to', 'caesar_bank_from', 'caesar_bank_to']

  // async create(createCashTransferDto: CreateCashTransferDto) {
  //   const { amount, from, to, caesar_bank, transfer_type, description } =
  //     createCashTransferDto
  //   /**
  //    * check if balance is sufficient
  //    */
  //   const caesarFrom = await this.caesarService.findOne(from)
  //   const caesarTo = await this.caesarService.findOne(to)
  //   const isBalanceEnough: boolean = (() => {
  //     return caesarFrom.data.caesar_coin > amount
  //   })()
  //   if (!isBalanceEnough) {
  //     throw new Error(`Caesar Sender has insuffcient balance`)
  //   }

  //   /**
  //    * proceed with sending
  //    */

  //   // const sendCCoinResult = await this.actualCaesarService.sendCcoin({
  //   //   amount,
  //   //   caesar_from: caesarFrom.data.wallet_id,
  //   //   caesar_to: caesarTo.data.wallet_id,

  //   //   message: message || `Cash Transfer from ${from}`,
  //   // })
  //   // console.log('sendCCoinResult', sendCCoinResult)

  //   const caesarBank = await this.caesarBankService.findOne(caesar_bank)
  //   const transferType = await this.transferTypeService.findOne(transfer_type)

  //   const newTransfer = this.cashTransferRepository.create({
  //     ...createCashTransferDto,
  //     transfer_type: transferType,
  //     // caesar_bank: caesarBank,
  //     from: caesarFrom,
  //     to: caesarTo,
  //     description,
  //   })

  // return this.cashTransferRepository.save(newTransfer)
  // }

  // private async checkSufficientBalance(
  //   caesarId: string,
  //   amount: number,
  // ): Promise<boolean> {
  //   return (
  //     (await this.caesarService.findOne(caesarId)).data.caesar_coin > amount
  //   )
  // }

  async findAll(getAllCashTransfer: GetAllCashTransferDto) {
    const {
      caesar_bank_from,
      caesar_bank_to,
      // transfer_type,
      to,
      from,
      date_from,
      date_to,
      caesar,
      caesar_bank,
      as,
    } = getAllCashTransfer

    const commonQuery = {
      ...(date_from && {
        created_at: MoreThan(getAllCashTransfer.date_from),
      }),
      ...(date_to && {
        created_at: LessThan(getAllCashTransfer.date_to),
      }),
      ...(as && {
        as,
      }),
    }
    return paginateFind(
      this.cashTransferRepository,
      {
        page: getAllCashTransfer.page,
        limit: getAllCashTransfer.limit,
      },
      {
        where:
          caesar || caesar_bank
            ? [
                ...(caesar
                  ? [
                      {
                        to: {
                          caesar_id: caesar,
                        },
                        ...commonQuery,
                      },
                      {
                        from: {
                          caesar_id: caesar,
                        },
                        ...commonQuery,
                      },
                      {
                        caesar_bank_from: {
                          caesar: caesar,
                        },
                      },
                      {
                        caesar_bank_to: {
                          caesar,
                        },
                      },
                    ]
                  : []),
                ...(caesar_bank
                  ? [
                      {
                        caesar_bank_to: caesar_bank,
                        ...commonQuery,
                      },
                      {
                        caesar_bank_from: caesar_bank,
                        ...commonQuery,
                      },
                    ]
                  : []),
              ]
            : {
                ...(caesar_bank_from && {
                  caesar_bank_from: getAllCashTransfer.caesar_bank_from,
                }),
                ...(caesar_bank_to && {
                  caesar_bank_to: getAllCashTransfer.caesar_bank_to,
                }),
                ...(to && {
                  to: getAllCashTransfer.to,
                }),
                ...(from && {
                  from: getAllCashTransfer.from,
                }),
                ...commonQuery,
              },
        order: {
          created_at: 'DESC',
        },
        relations: this.relations,
      },
      (data) => {
        return Promise.all(
          data.map(async (ea) => {
            return plainToInstance(CashTransfer, {
              ...ea,
              to: ea?.to && (await this.caesarService.findOne(ea.to.id)),
              from: ea?.from && (await this.caesarService.findOne(ea.from.id)),
            })
          }),
        )
      },
    )
  }

  async findOne(id: string) {
    return await this.cashTransferRepository.findOneOrFail(id, {
      relations: this.relations,
    })
  }

  async update(id: string, updateCashTransferDto: UpdateCashTransferDto) {
    const updateCashTransfer = await this.findOne(id)
    return this.cashTransferRepository.save({
      ...updateCashTransfer,
      ...updateCashTransferDto,
    })
  }

  delete(id: string) {
    return this.cashTransferRepository.delete(id)
    // return `This action removes a #${id} cashTransfer`
  }

  deleteAll() {
    return this.cashTransferRepository.clear()
  }

  async withdraw({
    amount,
    caesar_bank_from,
    to,
    description,
    as,
  }: { amount: number } & {
    caesar_bank_from: CaesarBank['id']
    to: Caesar['id']
    description
    bank_fee?: number
    as: CashTransferAs
  }) {
    // const transferType = await this.transferTypeService.findOne(transfer_type)
    // const transferType = await this.transferTypeRepository.findOneOrFail({
    //   name: transfer_type.toUpperCase(),
    // })
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
          .then(async (payResult) => {
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
      caesar_bank_from: bankWithDrawal,
      // transfer_type: transferType,
      to: caesarTo,
      description,
      as,
      remaining_balance_from: bankWithDrawal.balance,
      remaining_balance_to: caesarTo.cash_transfer_balance,
    }

    const newCashTransfer = this.cashTransferRepository.create(cashTransfer)
    return this.cashTransferRepository.save(newCashTransfer)
  }

  async deposit({
    caesar_bank_to,
    from,
    amount,
    description,
    bank_fee,
    as,
  }: {
    caesar_bank_to: CaesarBank['id']
    from: Caesar['id']
    amount: number
    bank_fee?: number
    description: string
    as: CashTransferAs
  }) {
    const caesarFrom = await this.caesarService.findOne(from)
    const caesarBankTo = await this.caesarBankService.findOne(caesar_bank_to)

    const cashTransferToCB = await this.caesarBankService
      .pay(caesarBankTo, amount)
      .then((res) => {
        return this.cashTransferRepository.save(
          this.cashTransferRepository.create({
            amount: amount,
            from: caesarFrom,
            as,
            bank_charge: bank_fee,
            // remaining_balance_from: cashTransferFrom.cash_transfer_balance,
            remaining_balance_from: caesarFrom.cash_transfer_balance,
            remaining_balance_to: res.balance,
            description,
            caesar_bank_to: caesarBankTo,
          } as Partial<CashTransfer>),
        )
      })
      .catch((err) => {
        console.log('deposit type, cashTransferToCbErrorToCb', err)
        throw err
      })
    return cashTransferToCB
  }

  async transfer({
    caesar_bank_from,
    caesar_bank_to,
    amount,
    description,
    bank_fee,
    as,
    to,
  }: {
    caesar_bank_from: CaesarBank['id']
    caesar_bank_to?: CaesarBank['id']
    amount: number
    // transfer_type: TransferType['id']
    description
    bank_fee?: number
    as: CashTransferAs
    to?: Caesar['id']
  }) {
    try {
      if (as === CashTransferAs.LOAN || as === CashTransferAs['LOAN PAYMENT']) {
        throw new Error(
          `Loan | Loan payments no longer working as cash-transfer, please use cashTransferService.loan`,
        )
      }

      /**
       * if cash transfer is in transfer form
       */
      // let caesarBankFrom: CaesarBank
      // if (as === CashTransferAs.TRANSFER) {
      //   caesarBankFrom = await this.caesarBankService.pay(
      //     caesar_bank_from,
      //     -amount - (bank_fee || 0),
      //   )
      // } else if (as === CashTransferAs.LOAN) {
      //   caesarBankFrom = await this.caesarBankService.pay(
      //     caesar_bank_from,
      //     -amount,
      //   )
      // }

      const caesarBankFrom = await this.caesarBankService.pay(
        caesar_bank_from,
        -amount - (bank_fee || 0),
      )

      /**
       * Deduct Amount from caeasrBank balance
       */
      await this.caesarService.payCashTransferBalance(
        caesarBankFrom.caesar,
        -amount - (bank_fee || 0),
      )

      /**
       * Loans will no longer need bank balances to be reflected by the system
       */
      const caesarBankTo = caesar_bank_to
        ? /**
           * Add Amount to Caesar Bank To
           */
          await this.caesarBankService
            .pay(caesar_bank_to, amount)
            .then(async (res) => {
              /**
               * record as balance even if bank transfer is made
               *
               */
              await this.caesarService.payCashTransferBalance(
                res.caesar,
                amount + (bank_fee || 0),
              )
              return res
            })
        : await this.caesarService.payCashTransferBalance(
            to,
            amount + (bank_fee || 0),
          )

      const cashTransfer: Partial<CashTransfer> = {
        amount,
        caesar_bank_from: caesarBankFrom,
        ...(caesar_bank_to
          ? {
              caesar_bank_to: caesarBankTo as CaesarBank,
            }
          : { to: caesarBankTo as Caesar }),

        // transfer_type: transferType,
        description,
        bank_charge: bank_fee,
        as,
        remaining_balance_from: caesarBankFrom.balance,
        remaining_balance_to: caesar_bank_to
          ? (caesarBankTo as CaesarBank).balance
          : (caesarBankTo as Caesar).cash_transfer_balance,
      }

      const newCashTransfer = this.cashTransferRepository.create(cashTransfer)
      return this.cashTransferRepository.save(newCashTransfer)
    } catch (err) {
      throw err
    }
  }

  async loan({
    caesar_bank_from,
    caesar_bank_to,
    amount,
    description,
    bank_fee,
    as,
    to,
  }: CreateCashTransferDto) {
    /**
     * find bank from and deduct amount + bank_fee
     * and deduct from ultimate caesar balance
     */
    const caesarBankFrom = await this.caesarBankService
      .findOne(caesar_bank_from)
      .then(async (res) => {
        const caesarBankPay = await this.caesarBankService.pay(
          res,
          -amount - (bank_fee || 0),
        )

        await this.caesarService.payCashTransferBalance(
          caesarBankPay.caesar,
          -amount - (bank_fee || 0),
        )
        return caesarBankPay
      })
      .catch((err) => {
        throw err
      })

    if (!caesar_bank_to && !to) {
      throw new Error(
        `Caesar Account or Caesar's Bank Account should be indicated`,
      )
    } else {
    }
    const caesarBankTo = await this.caesarBankService
      .findOne(caesar_bank_to)
      .then((res) => {
        // return this.caesarBankService.pay(res, amount).then(() => {
        //   return res
        // })
        return res
      })

    const caesarTo = await this.caesarService.findOne(to).then((res) => {
      return this.caesarService
        .payCashTransferBalance(res, amount + bank_fee)
        .then(() => res)
    })

    const remainingBalanceTo = await this.cashTransferRepository
      .find({
        as: CashTransferAs.LOAN,
        to: caesarTo,
      })
      .then(async (res) => {
        // return res.reduce((acc, ea) => {
        //   return acc + ea.loan_total()
        // }, 0)
        return 0
      })

    const newLoan: Partial<CashTransfer> = {
      amount,
      caesar_bank_from: caesarBankFrom,
      caesar_bank_to: caesarBankTo,
      to: caesarTo,
      description,
      bank_charge: bank_fee,
      as,
      remaining_balance_from: caesarBankFrom.balance,
      remaining_balance_to: remainingBalanceTo,
      // remaining_balance_to: caesar_bank_to
      //   ? (caesarBankTo as CaesarBank).balance
      //   : (caesarBankTo as Caesar).cash_transfer_balance,
    }

    return this.cashTransferRepository.save(newLoan)
  }

  async loanPayment({
    id,
    amount,
    caesar_bank_to,
    caesar_bank_from,
  }: CreateLoanPaymentDto) {
    const loan = await this.findOne(id).then((res) => {
      if (res.as !== CashTransferAs.LOAN) {
        throw new Error(`Cash Transfer is not of type Loan, cannot pay`)
      }
      return res
    })

    /**
     * deduct FROM caesar's and caesar_bank's balance
     */
    const caesarBankAndCaesar = await this.caesarBankService
      .findOne(caesar_bank_from)
      .then(async (res) => {
        /**
         * deduct caesar bank from
         */

        const caesarFrom = await this.caesarService.findOne(res.caesar.id)

        await this.caesarService.payCashTransferBalance(
          caesarFrom.id,
          caesarFrom.cash_transfer_balance >= amount
            ? -amount
            : caesarFrom.cash_transfer_balance,
        )

        return res
      })

    const caesarBankTo = await this.caesarBankService
      .findOne(caesar_bank_to)
      .then((res) => {
        return this.caesarBankService.pay(res.id, +amount)
      })
      .then(async (res) => {
        await this.caesarService.payCashTransferBalance(res.caesar.id, +amount)
        return res
      })

    const newPayment: Partial<CashTransfer> = {
      as: CashTransferAs['LOAN PAYMENT'],
      amount: amount,
      caesar_bank_from: loan.caesar_bank_to,
      caesar_bank_to: caesarBankTo,
      loan,
      remaining_balance_from: caesarBankAndCaesar.balance,
      remaining_balance_to: caesarBankTo.balance,
    }

    return this.cashTransferRepository.save(newPayment)

    // const paymentSave = () => {}
    // const determineInterest = () => {
    //   const dateNow = new Date(this.created_at)
    //   const hourNow = dateNow.getHours()
    //   const minuteNow = dateNow.getMinutes()
    //   if (hourNow > 9 && hourNow <= 13) {
    //     interestPercentage += 0.5
    //   }
    //   else if(hourNow < 13 && )
    // }
  }
}
