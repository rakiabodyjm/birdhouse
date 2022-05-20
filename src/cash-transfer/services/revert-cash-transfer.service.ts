import { RevertCashTransfer } from 'src/cash-transfer/entities/revert-cash-transfer.entity'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CaesarService } from 'src/caesar/caesar.service'
import { Caesar } from 'src/caesar/entities/caesar.entity'
import { FindOneOptions, Repository } from 'typeorm'
import { CreateCashTransferDto } from '../dto/cash-transfer/create-cash-transfer.dto'
import { CreateLoanPaymentDto } from '../dto/cash-transfer/create-loan-payment.dto'
import { CaesarBank } from '../entities/caesar-bank.entity'
import { CashTransfer, CashTransferAs } from '../entities/cash-transfer.entity'
import { CaesarBankService } from './caesar-bank.service'

@Injectable()
export class RevertCashTransferService {
  constructor(
    @InjectRepository(CashTransfer)
    private cashTransferRepository: Repository<CashTransfer>,
    private caesarBankService: CaesarBankService,
    private caesarService: CaesarService, // private actualCaesarService: ActualCaesarService,
    // @InjectRepository(TransferType)
    @InjectRepository(RevertCashTransfer)
    private revertCashTransferRepository: Repository<RevertCashTransfer>,
  ) {}

  relations = ['from', 'to', 'caesar_bank_from', 'caesar_bank_to']

  async findAll({ as }: { as?: CashTransferAs }) {
    return this.cashTransferRepository.find({
      where: {
        as,
      },
    })
  }

  async findByCTID(ref_num: string): Promise<CashTransfer> {
    const id = await this.cashTransferRepository.findOne(
      {
        ref_num,
      },
      { relations: this.relations },
    )
    return id
  }
  async findOne(id: string) {
    return await this.cashTransferRepository
      .findOneOrFail(id, {
        relations: this.relations,
      })
      .catch(() => {
        return this.findByRef(id)
      })
  }
  async findByRef(ref_num: string): Promise<CashTransfer> {
    return await this.cashTransferRepository.findOneOrFail(
      { ref_num },
      {
        relations: this.relations,
      },
    )
  }

  async revert({
    amount,
    caesar_bank_from,
    to,
    description,
    as,
    bank_charge,
    caesar_bank_to,
    from,
    message,
    id,
  }: Partial<CashTransfer>) {
    if (as === 'WITHDRAW') {
      const caesarTo = await this.caesarService.findOne(to.id)
      const caesarBankFrom = await this.caesarBankService.findOne(
        caesar_bank_from.id,
      )

      const caesarToUpdated = await this.caesarService.payCashTransferBalance(
        caesarTo.id,
        -amount,
      )

      const caeasrBankFromUpdated = await this.caesarBankService.pay(
        caesarBankFrom.id,
        +amount,
      )

      return this.cashTransferRepository.delete(id).then(async (res) => {
        return this.revertCashTransferRepository.save(
          this.revertCashTransferRepository.create({
            cash_transfer: await this.cashTransferRepository.findOne(id, {
              withDeleted: true,
            }),
          }),
        )
      })
    }
    if (as === 'DEPOSIT') {
      const caesarFrom = await this.caesarService.findOne(from.id)
      const caesarBankTo = await this.caesarBankService.findOne(
        caesar_bank_to.id,
      )

      const caesarBankToUpdated = await this.caesarBankService.pay(
        caesarBankTo.id,
        -amount,
      )

      const caesarFromUpdated = await this.caesarService.payCashTransferBalance(
        caesarFrom.id,
        amount,
      )

      return this.cashTransferRepository.delete(id).then(async (res) => {
        return this.revertCashTransferRepository.save(
          this.revertCashTransferRepository.create({
            cash_transfer: await this.cashTransferRepository.findOne(id, {
              withDeleted: true,
            }),
          }),
        )
      })
    }
    if (as === 'TRANSFER') {
      try {
        const caesarBankFrom = caesar_bank_from
          ? await this.caesarBankService.findOne(caesar_bank_from.id)
          : undefined

        const caesarFrom = from
          ? await this.caesarService.findOne(from.id)
          : undefined

        const caesarBankTo = caesar_bank_to
          ? await this.caesarBankService.findOne(caesar_bank_to.id)
          : undefined

        const caesarTo = to
          ? await this.caesarService.findOne(to.id)
          : undefined

        const caesarBankFromUpdated = caesarBankFrom
          ? await this.caesarBankService.pay(
              caesarBankFrom.id,
              amount + (bank_charge ? bank_charge : 0),
            )
          : undefined

        const caesarFromUpdated = caesarFrom
          ? await this.caesarService.payCashTransferBalance(
              caesarFrom.id,
              amount + (bank_charge ? bank_charge : 0),
            )
          : undefined

        const caesarBankToUpdated = caesarBankTo
          ? await this.caesarBankService.pay(caesarBankTo, -amount)
          : undefined

        const caesarToUpdated = caesarTo
          ? await this.caesarService.payCashTransferBalance(caesarTo, -amount)
          : undefined

        return this.cashTransferRepository.delete(id).then(async (res) => {
          return this.revertCashTransferRepository.save(
            this.revertCashTransferRepository.create({
              cash_transfer: await this.cashTransferRepository.findOne(id, {
                withDeleted: true,
              }),
            }),
          )
        })
      } catch (err) {
        throw err
      }
    }
    if (as === 'LOAN') {
      const caesarBankFrom = caesar_bank_from
        ? await this.caesarBankService.findOne(caesar_bank_from.id)
        : undefined

      const caesarFrom = from
        ? await this.caesarService.findOne(from.id)
        : undefined

      const caesarBankTo = caesar_bank_to
        ? await this.caesarBankService.findOne(caesar_bank_to.id)
        : undefined

      const caesarTo = to ? await this.caesarService.findOne(to.id) : undefined

      const caesarBankFromUpdated = caesarBankFrom
        ? await this.caesarBankService.pay(
            caesarBankFrom.id,
            amount + (bank_charge || 0),
          )
        : undefined

      const caesarFromUpdated = caesarFrom
        ? await this.caesarService.payCashTransferBalance(
            caesarFrom.id,
            amount + (bank_charge || 0),
          )
        : undefined

      const caesarBankToUpdated = caesarBankTo
        ? await this.caesarBankService.pay(caesarBankTo, -amount)
        : undefined

      const caesarToUpdated = caesarTo
        ? await this.caesarService.payCashTransferBalance(caesarTo, -amount)
        : undefined

      await this.caesarService.update(
        caesarTo?.id || caesarBankTo?.caesar?.id,
        {
          has_loan: true,
        },
      )

      return this.cashTransferRepository.delete(id).then(async (res) => {
        return this.revertCashTransferRepository.save(
          this.revertCashTransferRepository.create({
            cash_transfer: await this.cashTransferRepository.findOne(id, {
              withDeleted: true,
            }),
          }),
        )
      })
    }
    if (as === 'LOAN PAYMENT') {
      const loan = await this.findOne(id).then((res) => {
        return res
      })
      const payments = (await this.getLoanPayments(loan)).reduce((acc, ea) => {
        return acc + ea?.amount || 0
      }, 0)

      /**
       * calculate total payable
       */
      const totalPayable = loan.total_amount() - payments
      // if (amount > totalPayable) {
      //   throw new Error(`Payment exceeds total loan payable`)
      // }

      /**
       * if caesar_bank_from only
       */
      const caesarBankFrom = caesar_bank_from
        ? await this.caesarBankService.findOne(caesar_bank_from.id)
        : null

      const caesarFrom = await this.caesarService.findOne(
        caesarBankFrom?.caesar?.id || from.id,
      )

      const caesarBankTo = caesar_bank_to
        ? await this.caesarBankService.findOne(caesar_bank_to.id)
        : null

      const caesarTo = await this.caesarService.findOne(
        caesarBankTo?.caesar?.id || to.id,
      )

      /**
       * deduct from balance of caesarFrom and caesarBankFrom
       */

      let caesarFromUpdated
      let caesarBankFromUpdated
      let caesarToUpdated
      let caesarBankToUpdated

      if (caesarFrom) {
        caesarFromUpdated = await this.caesarService.payCashTransferBalance(
          caesarFrom.id,
          caesarFrom.cash_transfer_balance >= amount
            ? amount
            : caesarFrom.cash_transfer_balance,
        )
      }

      if (caesarBankFrom) {
        caesarBankFromUpdated = await this.caesarBankService.pay(
          caesarBankFrom,
          caesarBankFrom.balance >= amount ? amount : caesarBankFrom.balance,
        )
      }

      /**
       * add balance to caesarTo
       */
      if (caesarTo) {
        caesarToUpdated = await this.caesarService.payCashTransferBalance(
          caesarTo.id,
          -amount,
        )
      }

      /**
       * if destination is caesarBankTo
       * add balance to caesarBankTo
       */
      if (caesarBankTo) {
        caesarBankToUpdated = await this.caesarBankService.pay(
          caesarBankTo.id,
          -amount,
        )
      }
      return this.cashTransferRepository.delete(id).then(async (res) => {
        return this.revertCashTransferRepository.save(
          this.revertCashTransferRepository.create({
            cash_transfer: await this.cashTransferRepository.findOne(id, {
              withDeleted: true,
            }),
          }),
        )
      })
    }
  }

  async withdraw({
    amount,
    caesar_bank_from,
    to,
    description,
    as,
    id,
  }: Partial<CashTransfer> & { caesar_bank_from: CaesarBank }) {
    // const transferType = await this.transferTypeService.findOne(transfer_type)
    // const transferType = await this.transferTypeRepository.findOneOrFail({
    //   name: transfer_type.toUpperCase(),
    // })
    const caesarTo = await this.caesarService.findOne(to.id)
    const bankWithDrawal = await this.caesarBankService
      .findOne(caesar_bank_from.id)
      .then((res) => {
        /**
         * deduct from caesarBankService
         */
        return this.caesarBankService
          .pay(res.id, amount)
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
    return this.cashTransferRepository.delete(id).then(async (res) => {
      return this.revertCashTransferRepository.save(
        this.revertCashTransferRepository.create({
          cash_transfer: await this.cashTransferRepository.findOne(id, {
            withDeleted: true,
          }),
        }),
      )
    })
    // const newCashTransfer = this.cashTransferRepository.create(cashTransfer)
    // return this.cashTransferRepository.save(newCashTransfer)
  }

  async deposit({
    caesar_bank_to,
    from,
    amount,
    description,
    bank_charge,
    as,
    id,
  }: Partial<CashTransfer> & { caesar_bank_from: CaesarBank }) {
    const caesarFrom = await this.caesarService.findOne(from.id)
    const caesarBankTo = await this.caesarBankService.findOne(caesar_bank_to.id)

    const cashTransferToCB = await this.caesarBankService
      .pay(caesarBankTo, -amount)
      .then((payResult) => {
        return payResult
      })
      .catch((err) => {
        console.log('deposit type, cashTransferToCbErrorToCb', err)
        throw err
      })
    return this.cashTransferRepository.delete(id).then(async (res) => {
      return this.revertCashTransferRepository.save(
        this.revertCashTransferRepository.create({
          cash_transfer: await this.cashTransferRepository.findOne(id, {
            withDeleted: true,
          }),
        }),
      )
    })
  }

  async transfer({
    caesar_bank_from,
    caesar_bank_to,
    amount,
    description,
    bank_charge,
    as,
    to,
    message,
    id,
  }: Partial<CashTransfer>) {
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
        amount + (bank_charge || 0),
      )

      /**
       * Deduct Amount from caeasrBank balance
       */
      await this.caesarService.payCashTransferBalance(
        caesarBankFrom.caesar,
        amount + (bank_charge || 0),
      )

      /**
       * Loans will no longer need bank balances to be reflected by the system
       */
      const caesarBankTo = caesar_bank_to
        ? /**
           * Add Amount to Caesar Bank To
           */
          await this.caesarBankService
            .pay(caesar_bank_to, -amount)
            .then(async (res) => {
              /**
               * record as balance even if bank transfer is made
               *
               */
              await this.caesarService.payCashTransferBalance(
                res.caesar,
                amount + (bank_charge || 0),
              )
              return res
            })
        : await this.caesarService.payCashTransferBalance(
            to,
            amount + (bank_charge || 0),
          )

      return this.cashTransferRepository.delete(id).then(async (res) => {
        return this.revertCashTransferRepository.save(
          this.revertCashTransferRepository.create({
            cash_transfer: await this.cashTransferRepository.findOne(id, {
              withDeleted: true,
            }),
          }),
        )
      })
      // const cashTransfer: Partial<CashTransfer> = {
      //   amount,
      //   caesar_bank_from: caesarBankFrom,
      //   ...(caesar_bank_to
      //     ? {
      //         caesar_bank_to: caesarBankTo as CaesarBank,
      //       }
      //     : { to: caesarBankTo as Caesar }),

      //   // transfer_type: transferType,
      //   description,
      //   bank_charge: bank_charge,
      //   as,
      //   remaining_balance_from: caesarBankFrom.balance,
      //   remaining_balance_to: caesar_bank_to
      //     ? (caesarBankTo as CaesarBank).balance
      //     : (caesarBankTo as Caesar).cash_transfer_balance,
      //   message,
      // }

      // const newCashTransfer = this.cashTransferRepository.create(cashTransfer)
      // return this.cashTransferRepository.save(newCashTransfer)
    } catch (err) {
      throw err
    }
  }

  async loan({
    caesar_bank_from,
    caesar_bank_to,
    amount,
    description,
    bank_charge,
    as,
    to,
    id,
    message,
  }: Partial<CashTransfer> & { caesar_bank_from: CaesarBank }) {
    /**
     * find bank from and deduct amount + bank_fee
     * and deduct from ultimate caesar balance
     */
    if (!caesar_bank_to && !to) {
      throw new Error(
        `Caesar Account or Caesar's Bank Account should be indicated`,
      )
    }
    const caesarBankFrom = await this.caesarBankService
      .findOne(caesar_bank_from.id)
      .then(async (res) => {
        const caesarBankPay = await this.caesarBankService.pay(
          res,
          amount + (bank_charge || 0),
        )

        await this.caesarService.payCashTransferBalance(
          caesarBankPay.caesar,
          amount + (bank_charge || 0),
        )
        return caesarBankPay
      })
      .catch((err) => {
        throw err
      })

    const caesarBankTo = await this.caesarBankService
      .findOne(caesar_bank_to.id)
      .then((res) => {
        // return this.caesarBankService.pay(res, amount).then(() => {
        //   return res
        // })
        return res
      })

    const caesarTo = await this.caesarService.findOne(to.id).then((res) => {
      return this.caesarService
        .payCashTransferBalance(res, amount - (bank_charge || 0))
        .then(async () => {
          return res
        })
    })

    /**
     * update caesar to indicate it has loan
     *
     */
    await this.caesarService.update(caesarTo?.id || caesarBankTo?.caesar?.id, {
      has_loan: true,
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
      bank_charge: bank_charge,
      as,
      remaining_balance_from: caesarBankFrom.balance,
      remaining_balance_to: remainingBalanceTo,
      message,
      is_loan_paid: false,
    }

    return this.cashTransferRepository.delete(id).then(async (res) => {
      return this.revertCashTransferRepository.save(
        this.revertCashTransferRepository.create({
          cash_transfer: await this.cashTransferRepository.findOne(id, {
            withDeleted: true,
          }),
        }),
      )
    })
  }

  async loanPayment({
    id,
    amount,
    caesar_bank_to,
    caesar_bank_from,
    from,
    to,
  }: Partial<CashTransfer> & { caesar_bank_from: CaesarBank }) {
    const loan = await this.findOne(id).then((res) => {
      if (res.as === CashTransferAs.LOAN) {
        throw new Error(`Cash Transfer is not of type Loan, cannot pay`)
      }
      return res
    })

    /**
     * get payments done to this loan
     */
    const payments = (await this.getLoanPayments(loan)).reduce((acc, ea) => {
      return acc + ea?.amount || 0
    }, 0)

    /**
     * calculate total payable
     */
    const totalPayable = loan.total_amount() - payments
    // if (amount > totalPayable) {
    //   throw new Error(`Payment exceeds total loan payable`)
    // }

    /**
     * if caesar_bank_from only
     */
    const caesarBankFrom = caesar_bank_from
      ? await this.caesarBankService.findOne(caesar_bank_from.id)
      : null

    const caesarFrom = await this.caesarService.findOne(
      caesarBankFrom?.caesar?.id || from,
    )

    const caesarBankTo = caesar_bank_to
      ? await this.caesarBankService.findOne(caesar_bank_to.id)
      : null

    const caesarTo = await this.caesarService.findOne(
      caesarBankTo?.caesar?.id || to,
    )

    /**
     * deduct from balance of caesarFrom
     */

    await this.caesarService.payCashTransferBalance(
      caesarFrom.id,
      caesarFrom.cash_transfer_balance <= amount
        ? amount
        : -caesarFrom.cash_transfer_balance,
    )
    /**
     * add balance to caesarTo
     */
    this.caesarService.payCashTransferBalance(caesarTo.id, -amount)

    /**
     * if destination is caesarBankTo
     * add balance to caesarBankTo
     */
    if (caesarBankTo) {
      this.caesarBankService.pay(caesarBankTo?.id, -amount)
    }

    return this.cashTransferRepository.delete(id).then(async (res) => {
      return this.revertCashTransferRepository.save(
        this.revertCashTransferRepository.create({
          cash_transfer: await this.cashTransferRepository.findOne(id, {
            withDeleted: true,
          }),
        }),
      )
    })
  }

  /**
   *
   * @param param receives cash-transfer of type loan
   * @returns array of cash-transfer as payments
   */
  async getLoanPayments(param: CashTransfer | CashTransfer['id']) {
    const cashTransfer =
      typeof param !== 'string' ? param : await this.findOne(param)
    return this.cashTransferRepository.find({
      where: {
        as: CashTransferAs['LOAN PAYMENT'],
        loan: cashTransfer.id,
      },
    })
  }

  /**
   *
   * @param caesar receives Caesar account or ID
   * @returns query of finding loans of given caesar
   */
  async getLoans(
    caesar: Caesar | Caesar['id'],
    {
      paid,
    }: {
      paid?: boolean
    },
  ) {
    const caesarAccount =
      typeof caesar === 'string'
        ? await this.caesarService.findOne(caesar)
        : caesar

    const commonQuery: FindOneOptions<CashTransfer>['where'] = {
      as: CashTransferAs.LOAN,
      is_loan_paid: paid || false,
    }
    return this.cashTransferRepository.find({
      where: [
        {
          to: caesarAccount.id,
          ...commonQuery,
        },
        {
          caesar_bank_to: caesarAccount.id,
          ...commonQuery,
        },
      ],
    })
  }
}
