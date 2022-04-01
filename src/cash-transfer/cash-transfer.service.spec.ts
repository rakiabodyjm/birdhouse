import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Admin } from 'src/admin/entities/admin.entity'
import { CaesarService } from 'src/caesar/caesar.service'
import { Caesar } from 'src/caesar/entities/caesar.entity'
import { Bank } from 'src/cash-transfer/entities/bank.entity'
import { CaesarBank } from 'src/cash-transfer/entities/caesar-bank.entity'
import { CashTransfer } from 'src/cash-transfer/entities/cash-transfer.entity'
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
  },
  {
    id: 'caesar2',
    account_type: 'subdistributor',
    subdistributor: {
      name: 'Subdistributor 1',
    } as Subdistributor,
  },
]

let mockCaesarBankData: (Partial<CaesarBank> & { id: number | string })[] = [
  {
    id: 1,
    balance: 10000,
    bank: idFinder(1, mockBankData) as Bank,
    caesar: idFinder('caesar1', mockCaesarData) as Caesar,
  },
  {
    id: 2,
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
            async pay(caesarBankId: CaesarBank | number, amount: number) {
              const caesarBank = (
                typeof caesarBankId === 'number'
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
      ],
    }).compile()

    service = module.get<CashTransferService>(CashTransferService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('[Transfer] with sufficient balance', async () => {
    const caesar_bank_from = 1
    const caesar_bank_to = 2
    await service
      .transfer({
        amount: 100,
        caesar_bank_from,
        caesar_bank_to,
        transfer_type: 2,
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
  })

  it('[Transfer] if insufficient balance with error', async () => {
    const caesar_bank_from = 1
    const caesar_bank_to = 2
    await service
      .transfer({
        amount: 11000,
        caesar_bank_from,
        caesar_bank_to,
        transfer_type: 2,
      })
      .catch((err) => {
        expect(err).toBeDefined()
      })
      .then((res) => {
        expect(res).not.toBeDefined()
      })
  })

  it('[Withdraw] Successfully if sufficient balance', async (done) => {
    service
      .withdraw({
        amount: 9900,
        caesar_bank_from: 1,
        to: idFinder('caesar1', mockCaesarData).id,
        transfer_type: idFinder(2, mockTransferTypeData).id,
      })
      .then((cashTransfer) => {
        expect(cashTransfer.amount).toEqual(-9900)
      })
      .then(() => {
        const csr = idFinder(1, mockCaesarBankData)
        expect(csr.balance).toEqual(0)
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
        done()
      })
  })

  it('[Withdraw] if insufficient balance with error', async (done) => {
    service
      .withdraw({
        amount: 1,
        caesar_bank_from: 1,
        to: idFinder('caesar1', mockCaesarData).id,
        transfer_type: idFinder(2, mockTransferTypeData).id,
      })
      .then((cashTransfer) => {
        expect(cashTransfer).not.toBeDefined()
        // expect(cashTransfer.amount).toEqual(-9900)
      })
      .catch((err) => {
        expect(err).toBeDefined()
      })
      .finally(() => {
        done()
      })
  })

  it('[Deposit] successfully', async (done) => {
    service
      .deposit({
        amount: 1000,
        caesar_bank_to: 1,
        // from: idFinder(2, mockTransferTypeData).id,
        from: customFinder(['id', 'caesar1'], mockCaesarData).id,
        transfer_type: customFinder(['name', 'DEPOSIT'], mockTransferTypeData)
          .id,
      })
      .then((res) => {
        expect(res.amount).toBe(1000)
      })
      .then(() => {
        expect(idFinder(1, mockCaesarBankData).balance).toBe(1000)
      })
      .finally(() => {
        done()
      })
  })
})
