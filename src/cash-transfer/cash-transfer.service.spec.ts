import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Admin } from 'src/admin/entities/admin.entity'
import { CaesarService } from 'src/caesar/caesar.service'
import { Caesar } from 'src/caesar/entities/caesar.entity'
import { Bank } from 'src/cash-transfer/entities/bank.entity'
import { CaesarBank } from 'src/cash-transfer/entities/caesar-bank.entity'
import {
  CashTransfer,
  CashTransferAs,
} from 'src/cash-transfer/entities/cash-transfer.entity'
import { TransferType } from 'src/cash-transfer/entities/transfer-type.entity'
import { CaesarBankService } from 'src/cash-transfer/services/caesar-bank.service'
import { TransferTypeService } from 'src/cash-transfer/services/transfer-type.service'
import { Subdistributor } from 'src/subdistributor/entities/subdistributor.entity'
import { CashTransferService } from './services/cash-transfer.service'

type TypeWithId<T> = T extends { id: number | string } ? T : never
function idFinder<T>(id: number | string, data: TypeWithId<T>[]) {
  return data.find((ea) => ea.id === id)
}

function customFinder<T>(particle: [keyof T, T[keyof T]], dataSource: T[]) {
  return dataSource.find((ea) => ea[particle[0]] === particle[1])
}

const mockTransferTypeData: (Partial<TransferType> & { id: number })[] = [
  {
    id: 1,
    name: 'DEPOSIT',
    description: null,
  },
  {
    id: 2,
    name: 'TRANSFER',
    description: null,
  },
  {
    id: 3,
    name: 'LOAN',
    description: null,
  },
  {
    id: 4,
    name: 'PAYMENT',
    description: null,
  },
  {
    id: 5,
    name: 'WITHDRAWAL',
    description: null,
  },
  {
    id: 6,
    name: 'INTEREST',
    description: null,
  },
  {
    id: 7,
    name: 'FEES',
    description: null,
  },
  {
    id: 8,
    name: 'DISCOUNT',
    description: null,
  },
  {
    id: 9,
    name: 'REWARDS',
    description: null,
  },
  {
    id: 10,
    name: 'BONUS',
    description: null,
  },
  {
    id: 11,
    name: 'PENALTY',
    description: null,
  },
]
const mockBankData: Partial<Bank> & { id: number }[] = [
  {
    id: 1,
    description: 'BDO Unibank',
    name: 'BDO',
  },
  {
    id: 2,
    description: 'Mynt Globe Fintech',
    name: 'GCash',
  },
]
const mockCaesarData: (Partial<Caesar> & { id: string })[] = [
  {
    id: 'caesar1',
    account_type: 'admin',
    admin: {
      name: 'Admin 1',
    } as Admin,
    cash_transfer_balance: 0,
  },
  {
    id: 'caesar2',
    account_type: 'subdistributor',
    subdistributor: {
      name: 'Subdistributor 1',
    } as Subdistributor,
    cash_transfer_balance: 0,
  },
]

let mockCaesarBankData: (Partial<CaesarBank> & { id: number | string })[] = [
  {
    id: '1',
    balance: 0,
    bank: idFinder(1, mockBankData) as Bank,
    caesar: idFinder('caesar1', mockCaesarData) as Caesar,
  },
  {
    id: '2',
    balance: 0,
    bank: idFinder(2, mockBankData) as Bank,
    caesar: idFinder('caesar2', mockCaesarData) as Caesar,
  },
]

describe('CashTransferService', () => {
  let cashTransfersGenerated = []
  let service: CashTransferService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CashTransferService,
        {
          provide: CaesarBankService,
          useValue: {
            async findOne(id) {
              return idFinder(id, mockCaesarBankData)
            },
            async pay(
              caesarBankId: CaesarBank | CaesarBank['id'],
              amount: number,
            ) {
              const caesarBank = (
                typeof caesarBankId === 'string'
                  ? idFinder(caesarBankId, mockCaesarBankData)
                  : { ...caesarBankId }
              ) as CaesarBank

              if (amount < 0) {
                if (caesarBank.balance < Math.abs(amount)) {
                  throw new Error(`Insufficient Balance for this Caesar Bank`)
                }
              }
              caesarBank.balance = caesarBank.balance + amount
              mockCaesarBankData = mockCaesarBankData.reduce(
                (acc, ea, index, array) => {
                  if (ea.id === caesarBank.id) {
                    // return index
                    return [...acc, caesarBank]
                  }
                  return [...acc, ea]
                },
                [],
              )

              return caesarBank
            },
          },
        },
        {
          provide: TransferTypeService,
          useValue: {
            async findOne(id) {
              return idFinder(id, mockTransferTypeData)
            },
          },
        },
        {
          provide: CaesarService,
          useValue: {
            async findOne(id) {
              return idFinder(id, mockCaesarData)
            },
            async payCashTransferBalance(
              caesar: Caesar | Caesar['id'],
              amount: number,
            ) {
              let currentCaesar: Partial<Caesar>
              if (typeof caesar === 'string') {
                // currentCaesar = await this.findOne(caesar)
                currentCaesar = await mockCaesarData.find(
                  (ea) => ea.id === caesar,
                )
              } else {
                currentCaesar = caesar
              }
              let index: number
              mockCaesarData.some((ea, i) => {
                if (ea.id === currentCaesar.id) {
                  index = i
                  return true
                }
                return false
              })

              const copyMockCaesar = [...mockCaesarData]
              copyMockCaesar[index] = {
                ...copyMockCaesar[index],
                cash_transfer_balance:
                  copyMockCaesar[index].cash_transfer_balance + amount,
              }
              mockCaesarData == copyMockCaesar
            },
          },
        },
        {
          provide: getRepositoryToken(CashTransfer),
          useValue: {
            create(values) {
              return values
            },
            save(newCashTransfer) {
              cashTransfersGenerated = [
                ...cashTransfersGenerated,
                newCashTransfer,
              ]
              return newCashTransfer
            },
          },
          // useClass: Repository,
        },
        {
          provide: getRepositoryToken(TransferType),
          useValue: {
            async findOneOrFail(field: {
              [x: string | number | symbol]: unknown
            }) {
              // return idFinder(id, mockTransferTypeData)

              return mockTransferTypeData.find((ea) => {
                const entriesTuple = Object.entries(field)
                const key = entriesTuple[0]
                const value = entriesTuple[1]

                return ea[`${key}`] === value
              })
            },
          },
        },
      ],
    }).compile()

    service = module.get<CashTransferService>(CashTransferService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it.only('[Deposit] with Initial Balance of 10,000', async () => {
    await service
      .deposit({
        from: 'caesar1',
        caesar_bank_to: '1',
        as: CashTransferAs.DEPOSIT,
        description: `Initial Deposit`,
        amount: 10000,
        transfer_type: 'deposit',
        bank_fee: 0,
      })
      .then((res) => {
        expect(res).toBeDefined()
      })
  })

  it.only('[Transfer] with sufficient balance 100', async (done) => {
    const caesar_bank_from = '1'
    const caesar_bank_to = '2'
    await service
      .transfer({
        amount: 100,
        caesar_bank_from,
        caesar_bank_to,
        // transfer_type: 2,
        bank_fee: 25,
        description: `Test Transfer with sufficient balance`,
        transfer_type: 'transfer',
        as: CashTransferAs.TRANSFER,
      })
      .then((res) => {
        expect(res).toBeDefined()
        expect(res.amount).toBe(100)
        return res
      })
      .then((res) => {
        expect(
          (idFinder(caesar_bank_to, mockCaesarBankData) as CaesarBank).balance,
        ).toEqual(100)
        expect(
          (idFinder(caesar_bank_from, mockCaesarBankData) as CaesarBank)
            .balance,
        ).toEqual(9900)
      })
      .catch((err) => {
        expect(err).not.toBeDefined()
      })
      .finally(() => {
        done()
      })
  })

  it('[Transfer] if insufficient balance with error', async (done) => {
    const caesar_bank_from = '1'
    const caesar_bank_to = '2'
    await expect(
      service
        .transfer({
          amount: 11000,
          caesar_bank_from,
          caesar_bank_to,
          transfer_type: 'transfer',
          description: 'Transfer with insufficient balance',
          as: CashTransferAs.TRANSFER,
        })
        .catch((err) => {
          expect(err.message).toBeDefined()
        })
        .then((res) => {
          expect(res).not.toBeDefined()
        }),
    ).rejects.toBeDefined()
  })

  it('[Withdraw] Successfully if sufficient balance', async (done) => {
    await service
      .withdraw({
        amount: 9900,
        caesar_bank_from: '1',
        to: idFinder('caesar1', mockCaesarData).id,
        transfer_type: 'withdraw',
        description:
          'Withdraw successfully with sufficient balance from caesar_bank_from',
        as: CashTransferAs.WITHDRAW,
      })
      .then((cashTransfer) => {
        expect(cashTransfer.amount).toEqual(-9900)
      })
      .then(() => {
        const csr = idFinder(1, mockCaesarBankData)
        expect(csr.balance).toEqual(0)
      })
  })

  it('[Withdraw] if insufficient balance with error', async (done) => {
    expect(
      service
        .withdraw({
          amount: 1,
          caesar_bank_from: '1',
          to: idFinder('caesar1', mockCaesarData).id,
          // transfer_type: idFinder(2, mockTransferTypeData).id,
          transfer_type: 'withdraw',
          description: `Withdraw with insufficient balance with error`,
          as: CashTransferAs.WITHDRAW,
        })
        .then((cashTransfer) => {
          expect(cashTransfer).not.toBeDefined()
          // expect(cashTransfer.amount).toEqual(-9900)
        })
        .catch((err) => {
          expect(err.message).toBeDefined()
        }),
    ).rejects
  })

  it('[Deposit] successfully', async (done) => {
    await service
      .deposit({
        amount: 1000,
        caesar_bank_to: '1',
        from: customFinder(['id', 'caesar1'], mockCaesarData).id,
        transfer_type: 'deposit',
        description: `Deposit succesfully with sufficient balance`,
        as: CashTransferAs.DEPOSIT,
      })
      .then((res) => {
        expect(res.amount).toBe(1000)
      })
      .then(() => {
        expect(idFinder(1, mockCaesarBankData).balance).toBe(1000)
      })
  })

  it('Should all be balanced', () => {
    const withdrawAmounts = cashTransfersGenerated
      .filter((ea) => ea.as === 'WITHDRAW')
      .reduce((acc, ea) => {
        return acc + ea.amount
      }, 0)
    console.log('WITHDRAWN', withdrawAmounts)
    const depositAmounts = cashTransfersGenerated
      .filter((ea) => ea.as === 'DEPOSIT')
      .reduce((acc, ea) => {
        return acc + ea.amount
      }, 0)

    console.log('DEPOSITED', depositAmounts)

    const caesarBalances = mockCaesarData.reduce(
      (acc, ea) => acc + ea.cash_transfer_balance,
      0,
    )
    console.log('CAESAR BALANCES', caesarBalances)

    const bankBalances = mockCaesarBankData.reduce(
      (acc, ea) => acc + ea.balance,
      0,
    )
    console.log('BANK BALANCES', bankBalances)

    expect(
      cashTransfersGenerated.reduce((acc, ea) => {
        return acc + ea.amount
      }, 0),
    ).toBe(depositAmounts - withdrawAmounts)
  })
  afterAll(() => {
    console.log('cashTransfersGenerated', cashTransfersGenerated)
  })
})
