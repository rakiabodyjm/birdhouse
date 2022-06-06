import { CreateWithdrawTransferDto } from './../dto/cash-transfer/create-withdraw-transfer.dto'
import { CreateDepositTransferDto } from './../dto/cash-transfer/create-deposit-transfer.dto'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CaesarService } from 'src/caesar/caesar.service'
import { Caesar } from 'src/caesar/entities/caesar.entity'
import { CreateCashTransferDto } from 'src/cash-transfer/dto/cash-transfer/create-cash-transfer.dto'
import { GetAllCashTransferDto } from 'src/cash-transfer/dto/cash-transfer/get-all-cash-transfer.dto'
import { UpdateCashTransferDto } from 'src/cash-transfer/dto/cash-transfer/update-cash-transfer.dto'
import {
  CashTransfer,
  CashTransferAs,
} from 'src/cash-transfer/entities/cash-transfer.entity'
import { CaesarBankService } from 'src/cash-transfer/services/caesar-bank.service'
import paginateFind from 'src/utils/paginate'
import {
  FindOneOptions,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm'
import { plainToInstance } from 'class-transformer'
import { v4 } from 'uuid'
import { CreateLoanPaymentDto } from 'src/cash-transfer/dto/cash-transfer/create-loan-payment.dto'
import { CreateLoanTransferDto } from 'src/cash-transfer/dto/cash-transfer/create-loan-transfer.dto'
import { SQLDateGenerator } from 'src/utils/SQLDateGenerator'

@Injectable()
export class CashTransferService {
  constructor(
    @InjectRepository(CashTransfer)
    private cashTransferRepository: Repository<CashTransfer>,
    private caesarBankService: CaesarBankService,
    // private transferTypeService: TransferTypeService,
    private caesarService: CaesarService, // private actualCaesarService: ActualCaesarService, // @InjectRepository(TransferType) // private transferTypeRepository: Repository<TransferType>,
  ) {}

  relations = [
    'from',
    'to',
    'caesar_bank_from',
    'caesar_bank_to',
    'caesar_bank_from.caesar',
    'caesar_bank_to.caesar',
    'loan',
  ]

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
      account_type,
      as,
      ref_num,
      id,
    } = getAllCashTransfer
    let { loan } = getAllCashTransfer
    loan = typeof loan === 'string' ? await this.findOne(loan) : loan
    const commonQuery = {
      ...(date_from && {
        created_at: MoreThanOrEqual(
          new SQLDateGenerator(getAllCashTransfer.date_from).getSQLDate(),
        ),
      }),
      ...(date_to && {
        created_at: LessThanOrEqual(
          new SQLDateGenerator(getAllCashTransfer.date_to).getSQLDate(),
        ),
      }),
      ...(as && {
        as,
      }),
      ...(loan && {
        loan,
      }),
      ...(id && {
        id,
      }),
      ...(ref_num && { ref_num }),
    }

    const finalQuery =
      caesar || caesar_bank || account_type
        ? [
            ...(caesar
              ? [
                  {
                    to: {
                      id: caesar,
                    },
                    ...commonQuery,
                  },
                  {
                    from: {
                      id: caesar,
                    },
                    ...commonQuery,
                  },
                  {
                    caesar_bank_from: {
                      caesar: {
                        id: caesar,
                      },
                    },
                    ...commonQuery,
                  },
                  {
                    caesar_bank_to: {
                      caesar: {
                        id: caesar,
                      },
                    },
                    ...commonQuery,
                  },
                ]
              : []),
            ...(caesar_bank
              ? [
                  {
                    to: {
                      id: caesar,
                    },
                    ...commonQuery,
                  },
                  {
                    from: {
                      id: caesar,
                    },
                    ...commonQuery,
                  },
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
            ...(account_type
              ? [
                  {
                    to: {
                      account_type,
                    },
                    ...commonQuery,
                  },
                  {
                    from: {
                      account_type,
                    },
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
          }
    return paginateFind(
      this.cashTransferRepository,
      {
        page: getAllCashTransfer.page,
        limit: getAllCashTransfer.limit,
      },
      {
        where: finalQuery,
        order: {
          created_at: 'DESC',
        },
        relations: [...this.relations],
        withDeleted: true,
      },
      (data) => {
        return Promise.all(
          data.map(async (ea) => {
            const returnValue = plainToInstance(CashTransfer, {
              ...ea,
              to: ea?.to && (await this.caesarService.findOne(ea.to.id)),
              from: ea?.from && (await this.caesarService.findOne(ea.from.id)),
            })

            return returnValue
          }),
        )
      },
    )
  }

  async findAllRetailersLoanOfThisCaesar(caesarId: Caesar['id']) {
    const data = await this.caesarService.findOne(caesarId, {
      relations: ['dsp.retailer'],
    })

    const caesar = await Promise.all(
      data.dsp.retailer.map(async (ea) => {
        const ret = (
          await this.findAll({
            caesar: (await ea).caesar_wallet.id,
            as: CashTransferAs.LOAN,
          })
        ).data
        return ret
      }),
    )
    return caesar.flatMap((ea) => ea)
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

  async update(id: string, updateCashTransferDto: UpdateCashTransferDto) {
    const updateCashTransfer = await this.findOne(id)
    return plainToInstance(
      CashTransfer,
      await this.cashTransferRepository.save({
        ...updateCashTransfer,
        ...updateCashTransferDto,
      }),
    )
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
    bank_fee,
  }: CreateWithdrawTransferDto) {
    const caesarTo = await this.caesarService.findOne(to)
    const caesarBankFrom = await this.caesarBankService.findOne(
      caesar_bank_from,
    )

    const caesarToUpdated = await this.caesarService.payCashTransferBalance(
      caesarTo.id,
      +amount,
    )

    const caeasrBankFromUpdated = await this.caesarBankService.pay(
      caesarBankFrom.id,
      -amount,
    )

    const cashTransfer: Partial<CashTransfer> = {
      amount: amount,
      caesar_bank_from: caesarBankFrom,
      to: caesarTo,
      description,
      as,
      ref_num: await this.generateRefNum(as),
      remaining_balance_from: caeasrBankFromUpdated.balance,
      remaining_balance_to: caesarToUpdated.cash_transfer_balance,
      bank_charge: bank_fee,
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
  }: CreateDepositTransferDto): Promise<CashTransfer> {
    const caesarFrom = await this.caesarService.findOne(from)
    const caesarBankTo = await this.caesarBankService.findOne(caesar_bank_to)

    const caesarBankToUpdated = await this.caesarBankService.pay(
      caesarBankTo.id,
      amount,
    )

    const caesarFromUpdated = await this.caesarService.payCashTransferBalance(
      caesarFrom.id,
      -amount,
    )

    const cashTransferToCB = this.cashTransferRepository.save(
      this.cashTransferRepository.create({
        amount: amount,
        from: caesarFrom,
        as,
        bank_charge: bank_fee,
        remaining_balance_from: caesarFromUpdated.cash_transfer_balance,
        remaining_balance_to: caesarBankToUpdated.balance,
        description,
        ref_num: await this.generateRefNum(as),
        caesar_bank_to: caesarBankTo,
      } as Partial<CashTransfer>),
    )

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
    from,
    message,
  }: CreateCashTransferDto) {
    try {
      if (as === CashTransferAs.LOAN || as === CashTransferAs['LOAN PAYMENT']) {
        throw new Error(
          `Loan | Loan payments no longer working as cash-transfer, please use cashTransferService.loan`,
        )
      }
      if ((caesar_bank_to && to) || (caesar_bank_from && from)) {
        throw new Error(
          `Cash Transfer must only include one source and one destination`,
        )
      }

      if (!(caesar_bank_to || to) || !(caesar_bank_from || from)) {
        throw new Error(`
        Cash Transfer must include one source and one destination account`)
      }

      const bankFee = bank_fee || 0

      const caesarBankFrom = caesar_bank_from
        ? await this.caesarBankService.findOne(caesar_bank_from)
        : undefined

      const caesarFrom = from
        ? await this.caesarService.findOne(from)
        : undefined

      const caesarBankTo = caesar_bank_to
        ? await this.caesarBankService.findOne(caesar_bank_to)
        : undefined

      const caesarTo = to ? await this.caesarService.findOne(to) : undefined

      const caesarBankFromUpdated = caesarBankFrom
        ? await this.caesarBankService.pay(caesarBankFrom.id, -amount - bankFee)
        : undefined

      const caesarFromUpdated = caesarFrom
        ? await this.caesarService.payCashTransferBalance(
            caesarFrom.id,
            -amount,
          )
        : undefined

      const caesarBankToUpdated = caesarBankTo
        ? await this.caesarBankService.pay(caesarBankTo, amount)
        : undefined

      const caesarToUpdated = caesarTo
        ? await this.caesarService.payCashTransferBalance(caesarTo, amount)
        : undefined

      const newCashTransfer: Partial<CashTransfer> = {
        amount,
        as,
        ref_num: await this.generateRefNum(as),
        bank_charge: bank_fee,
        caesar_bank_from: caesarBankFrom,
        caesar_bank_to: caesarBankTo,
        remaining_balance_from: caesarBankFromUpdated
          ? caesarBankFromUpdated?.balance
          : caesarFromUpdated?.cash_transfer_balance,
        remaining_balance_to: caesarBankToUpdated
          ? caesarBankToUpdated?.balance
          : caesarToUpdated.cash_transfer_balance,
        description,
        message,
        from: caesarFrom,
        to: caesarTo,
      }

      return this.cashTransferRepository.save(newCashTransfer)
    } catch (err) {
      throw err
    }
  }

  async loan({
    caesar_bank_from,
    from,
    caesar_bank_to,
    to,
    amount,
    description,
    bank_fee,
    as,
  }: CreateLoanTransferDto) {
    const bankFee = bank_fee || 0
    /**
     * find bank from and deduct amount + bank_fee
     * and deduct from ultimate caesar balance
     */
    if ((caesar_bank_to && to) || (caesar_bank_from && from)) {
      throw new Error(`Loan must only include one source and one destination`)
    }
    if (!(from || caesar_bank_from) || !(to || caesar_bank_to)) {
      throw new Error(
        `Must have one source account and one destination account`,
      )
    }

    const caesarBankFrom = caesar_bank_from
      ? await this.caesarBankService.findOne(caesar_bank_from)
      : undefined

    const caesarFrom = from ? await this.caesarService.findOne(from) : undefined

    const caesarBankTo = caesar_bank_to
      ? await this.caesarBankService.findOne(caesar_bank_to)
      : undefined

    const caesarTo = to ? await this.caesarService.findOne(to) : undefined

    const caesarBankFromUpdated = caesarBankFrom
      ? await this.caesarBankService.pay(caesarBankFrom.id, -amount - bankFee)
      : undefined

    const caesarFromUpdated = caesarFrom
      ? await this.caesarService.payCashTransferBalance(
          caesarFrom.id,
          -amount - bankFee,
        )
      : undefined

    const caesarBankToUpdated = caesarBankTo
      ? await this.caesarBankService.pay(caesarBankTo, amount)
      : undefined

    const caesarToUpdated = caesarTo
      ? await this.caesarService.payCashTransferBalance(
          caesarTo,
          amount - bankFee,
        )
      : undefined

    await this.caesarService.update(caesarTo?.id || caesarBankTo?.caesar?.id, {
      has_loan: true,
    })

    const dateToday = new Date(Date.now())
    let checkDate

    if (dateToday.getHours() > 22 || dateToday.getDay() === 0) {
      const date = dateToday.setDate(dateToday.getDate() + 1)
      const newDay = new Date(date)
      const hour = newDay.setHours(6, 0, 0)
      const newHour = new Date(hour)
      console.log(new Date(newDay).toLocaleString())
      console.log(new Date(newHour).toLocaleString())
      checkDate = newHour
    }

    const newLoan: Partial<CashTransfer> = {
      amount,
      caesar_bank_from: caesarBankFrom,
      caesar_bank_to: caesarBankTo,
      to: caesarTo,
      from: caesarFrom,
      description,
      bank_charge: bank_fee,
      as,
      created_at: checkDate,
      ref_num: await this.generateRefNum(as),
      // remaining_balance_from:
      //   caesarBankFromUpdated?.balance ||
      //   caesarFromUpdated?.cash_transfer_balance||0,
      remaining_balance_from: caesarBankFromUpdated
        ? caesarBankFromUpdated.balance
        : caesarFromUpdated.cash_transfer_balance,
      // remaining_balance_to:
      // caesarBankToUpdated?.balance || caesarToUpdated?.cash_transfer_balance||0,
      remaining_balance_to: caesarBankToUpdated
        ? caesarBankToUpdated.balance
        : caesarToUpdated.cash_transfer_balance,
      is_loan_paid: false,
    }

    return this.cashTransferRepository.save(newLoan)
  }

  async loanPayment({
    id,
    amount,
    caesar_bank_to,
    caesar_bank_from,
    from,
    to,
  }: CreateLoanPaymentDto) {
    if (!(from || caesar_bank_from) || !(to || caesar_bank_to)) {
      throw new Error(
        `Must have one source account and one destination account`,
      )
    }

    const loan = await this.findOne(id).then((res) => {
      if (res.as !== CashTransferAs.LOAN) {
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
      ? await this.caesarBankService.findOne(caesar_bank_from)
      : undefined

    const caesarFrom = from ? await this.caesarService.findOne(from) : undefined

    const caesarBankTo = caesar_bank_to
      ? await this.caesarBankService.findOne(caesar_bank_to)
      : undefined

    const caesarTo = to ? await this.caesarService.findOne(to) : undefined

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
        caesarFrom.cash_transfer_balance >= amount
          ? -amount
          : -caesarFrom.cash_transfer_balance,
      )
    }

    if (caesarBankFrom) {
      caesarBankFromUpdated = await this.caesarBankService.pay(
        caesarBankFrom,
        caesarBankFrom.balance >= amount ? -amount : -caesarBankFrom.balance,
      )
    }

    /**
     * add balance to caesarTo
     */
    if (caesarTo) {
      caesarToUpdated = await this.caesarService.payCashTransferBalance(
        caesarTo,
        amount,
      )
    }

    /**
     * if destination is caesarBankTo
     * add balance to caesarBankTo
     */
    if (caesarBankTo) {
      caesarBankToUpdated = await this.caesarBankService.pay(
        caesarBankTo,
        amount,
      )
    }

    // console.log(
    //   caesarBankFromUpdated,
    //   caesarFromUpdated,
    //   caesarBankToUpdated,
    //   caesarToUpdated,
    // )

    const newLoanPayment: Partial<CashTransfer> =
      this.cashTransferRepository.create({
        loan: id,
        amount,
        caesar_bank_from: caesarBankFrom || null,
        caesar_bank_to: caesarBankTo || null,
        to: caesarTo || null,
        from: caesarFrom || null,
        ref_num: await this.generateRefNum(CashTransferAs['LOAN PAYMENT']),
        as: CashTransferAs['LOAN PAYMENT'],

        remaining_balance_from:
          caesarBankFromUpdated?.balance ||
          caesarFromUpdated?.cash_transfer_balance,
        remaining_balance_to:
          caesarBankToUpdated?.balance ||
          caesarToUpdated?.cash_transfer_balance,
      })
    console.log(newLoanPayment)

    return this.cashTransferRepository
      .save(newLoanPayment)
      .then(async (res) => {
        /**
         *
         */
        console.log('newLoanPayment', res)

        if (totalPayable <= amount) {
          await this.cashTransferRepository.save({
            ...loan,
            is_loan_paid: true,
          })
        }
        /**
         * clear caesar of balance
         */

        if (
          (
            await this.cashTransferRepository.find({
              where: [
                {
                  to: caesarFrom?.id,
                  is_loan_paid: false,
                  as: CashTransferAs.LOAN,
                },
                {
                  caesar_bank_to: caesarBankFrom?.id,
                  is_loan_paid: false,
                  as: CashTransferAs.LOAN,
                },
              ],
            })
          ).length === 0
        ) {
          await this.caesarService.update(
            caesarFrom?.id ? caesarFrom.id : caesarBankFrom.caesar.id,
            {
              has_loan: false,
            },
          )
        }
        return res
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

  private async generateRefNum(as: CashTransferAs) {
    const keysRecord: Record<CashTransferAs, string> = {
      DEPOSIT: '-DP-',
      LOAN: '-LN-',
      TRANSFER: '-TF-',
      WITHDRAW: '-WD-',
      'LOAN PAYMENT': '-LP-',
    }
    let ref_num: string
    const date = new Date()
    const month = date.getMonth() + 1
    const fileNameExt =
      date.getFullYear().toString().substring(2, 4) +
      month.toString().padStart(2, '0') +
      date.getDate().toString().padStart(2, '0')

    const uuidTag: string = v4().split('-')[4].toUpperCase()
    const duplicateID = await this.findByCTID(ref_num)

    if (duplicateID) {
      ref_num = fileNameExt + keysRecord[as] + uuidTag
    } else {
      ref_num = fileNameExt + keysRecord[as] + uuidTag
    }

    return ref_num
  }
}

// class NewCashTransferService {
//   constructor()
// }
