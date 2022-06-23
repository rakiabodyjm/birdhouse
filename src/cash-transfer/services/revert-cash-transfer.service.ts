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
import { CashTransferService } from './cash-transfer.service'

@Injectable()
export class RevertCashTransferService {
  constructor(
    @InjectRepository(CashTransfer)
    private cashTransferRepository: Repository<CashTransfer>,
    private caesarBankService: CaesarBankService,
    private caesarService: CaesarService,
    private cashTransferService: CashTransferService, // private actualCaesarService: ActualCaesarService,
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
    commmision,
  }: Partial<CashTransfer>) {
    const bankFee = bank_charge || 0
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
    }
    if (as === 'TRANSFER') {
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
        ? await this.caesarBankService.pay(caesarBankFrom.id, amount + bankFee)
        : undefined

      const caesarFromUpdated = caesarFrom
        ? await this.caesarService.payCashTransferBalance(caesarFrom.id, amount)
        : undefined

      const caesarBankToUpdated = caesarBankTo
        ? await this.caesarBankService.pay(caesarBankTo, -amount)
        : undefined

      const caesarToUpdated = caesarTo
        ? await this.caesarService.payCashTransferBalance(caesarTo, -amount)
        : undefined
    }

    if (as === 'LOAD') {
      const caesarBankFrom = caesar_bank_from
        ? await this.caesarBankService.findOne(caesar_bank_from.id)
        : undefined

      const caesarBankTo = caesar_bank_to
        ? await this.caesarBankService.findOne(caesar_bank_to.id)
        : undefined

      const caesarBankFromUpdated = caesarBankFrom
        ? await this.caesarBankService.pay(caesarBankFrom.id, amount)
        : undefined

      const caesarBankToUpdated = caesarBankTo
        ? await this.caesarBankService.pay(caesarBankTo, -amount)
        : undefined
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
        ? await this.caesarBankService.pay(caesarBankFrom.id, amount + bankFee)
        : undefined

      const caesarFromUpdated = caesarFrom
        ? await this.caesarService.payCashTransferBalance(
            caesarFrom.id,
            amount + bankFee,
          )
        : undefined

      const caesarBankToUpdated = caesarBankTo
        ? await this.caesarBankService.pay(caesarBankTo, -amount)
        : undefined

      const caesarToUpdated = caesarTo
        ? await this.caesarService.payCashTransferBalance(
            caesarTo,
            -amount + bankFee,
          )
        : undefined

      await this.caesarService.update(
        caesarTo?.id || caesarBankTo?.caesar?.id,
        {
          has_loan: false,
        },
      )
    }
    if (as === 'LOAD PAYMENT') {
      const loan = await this.findOne(id).then((res) => {
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

      const caesarFrom = from
        ? await this.caesarService.findOne(from.id)
        : undefined

      const caesarBankTo = caesar_bank_to
        ? await this.caesarBankService.findOne(caesar_bank_to.id)
        : null

      const caesarTo = to ? await this.caesarService.findOne(to.id) : undefined

      /**¸
       * deduct from balance of caesarFrom and caesarBankFrom
       */

      let caesarFromUpdated
      let caesarBankFromUpdated
      let caesarToUpdated
      let caesarBankToUpdated

      if (caesarFrom) {
        caesarFromUpdated = await this.caesarService.payCashTransferBalance(
          caesarFrom,
          caesarFrom.cash_transfer_balance < amount
            ? amount
            : caesarFrom.cash_transfer_balance,
        )
      }

      if (caesarBankFrom) {
        caesarBankFromUpdated = await this.caesarBankService.pay(
          caesarBankFrom,
          caesarBankFrom.balance < amount ? amount : caesarBankFrom.balance,
        )
      }

      /**
       * add balance to caesarTo
       */
      if (caesarTo) {
        caesarToUpdated = await this.caesarService.payCashTransferBalance(
          caesarTo,
          -amount,
        )
      }

      /**
       * if destination is caesarBankTo
       * add balance to caesarBankTo
       */
      if (caesarBankTo) {
        caesarBankToUpdated = await this.caesarBankService.pay(
          caesarBankTo,
          -amount,
        )
      }

      await this.cashTransferService.findOne(id).then((res) =>
        this.cashTransferService.update(res.loan.id, {
          is_loan_paid: false,
        }),
      )
    }
    if (as === 'LOAN PAYMENT') {
      const loan = await this.findOne(id).then((res) => {
        return res
      })
      const caesarBankFromC = await this.caesarBankService.findOne(
        '1e12b708-c6f1-ec11-8cf8-00155d1cd40b',
      )
      const caesarBankFrom = caesar_bank_from
        ? await this.caesarBankService.findOne(caesar_bank_from.id)
        : undefined
      const caesarBankTo = caesar_bank_to
        ? await this.caesarBankService.findOne(caesar_bank_to.id)
        : undefined
      const caesarTo = to ? await this.caesarService.findOne(to.id) : undefined
      const caesarFrom = from
        ? await this.caesarService.findOne(from.id)
        : undefined

      let caesarBankFromUpdatedC
      let caesarFromUpdated
      let caesarBankFromUpdated
      let caesarToUpdated
      let caesarBankToUpdated

      if (caesarBankFromC) {
        caesarBankFromUpdatedC = await this.caesarBankService.pay(
          caesarBankFromC,
          -commmision,
        )
      }
      if (caesarFrom) {
        caesarFromUpdated = await this.caesarService.payCashTransferBalance(
          caesarFrom,
          caesarFrom.cash_transfer_balance < amount
            ? amount
            : caesarFrom.cash_transfer_balance,
        )
      }

      if (caesarBankFrom) {
        caesarBankFromUpdated = await this.caesarBankService.pay(
          caesarBankFrom,
          caesarBankFrom.balance < amount ? amount : caesarBankFrom.balance,
        )
      }
      if (caesarTo) {
        caesarToUpdated = await this.caesarService.payCashTransferBalance(
          caesarTo,
          -amount + commmision,
        )
      }

      if (caesarBankTo) {
        caesarBankToUpdated = await this.caesarBankService.pay(
          caesarBankTo,
          -amount + commmision,
        )
      }
      await this.cashTransferService.findOne(id).then((res) =>
        this.cashTransferService.update(res.loan.id, {
          is_loan_paid: false,
        }),
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
