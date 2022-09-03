import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { randomUUID } from 'crypto'
import { Admin } from 'src/admin/entities/admin.entity'
import { CaesarService } from 'src/caesar/caesar.service'
import { Caesar } from 'src/caesar/entities/caesar.entity'
import { Bank } from 'src/cash-transfer/entities/bank.entity'
import { CaesarBank } from 'src/cash-transfer/entities/caesar-bank.entity'
import {
  CashTransfer,
  CashTransferAs,
} from 'src/cash-transfer/entities/cash-transfer.entity'
import { CaesarBankService } from 'src/cash-transfer/services/caesar-bank.service'
import { Subdistributor } from 'src/subdistributor/entities/subdistributor.entity'
import { CashTransferService } from './services/cash-transfer.service'

type TypeWithId<T> = T extends { id: number | string } ? T : never
function findById<T>(id: number | string, data: TypeWithId<T>[]): T {
  const result = data.find((ea) => ea.id === id)
  if (!result) {
    throw new Error(`Element with id ${id} doesn't exist`)
  }
  return result
}

function findByKeyValue<T>(particle: [keyof T, T[keyof T]], dataSource: T[]) {
  return dataSource.find((ea) => ea[particle[0]] === particle[1])
}

function updateById<T extends { id: string | number }>(
  id: number | string,
  data: T[],
  updateData: Partial<T>,
) {
  let index: number
  const findResult = data.find((fi, ind) => {
    if (fi.id === id) {
      index = ind
      return true
    }
    return false
  })

  if (!findResult) {
    throw new Error(`Data doesn't exist`)
  }

  const updateValue = {
    ...findResult,
    ...updateData,
  }
  data[index] = updateValue

  return updateValue
}
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

const mockCaesarBankData: (Partial<CaesarBank> & { id: string })[] = [
  {
    id: '1',
    bank: findById(1, mockBankData) as Bank,
    caesar: findById('caesar1', mockCaesarData) as Caesar,
    balance: 0,
  },
  {
    id: '2',
    bank: findById(2, mockBankData) as Bank,
    caesar: findById('caesar2', mockCaesarData) as Caesar,
    balance: 0,
  },
]

const mockCashTransfer: Partial<CashTransfer> & { id: string }[] = []
const moduleInsantiate = async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      CashTransferService,
      {
        provide: CaesarService,
        useValue: {
          findOne: async (id: string) => {
            return findById(id, mockCaesarData)
          },
          payCashTransferBalance: async (
            id: Partial<Caesar>,
            amount: number,
          ) => {
            if (typeof id === 'string') {
              return updateById(id, mockCaesarData, {
                cash_transfer_balance:
                  (await findById(id, mockCaesarData).cash_transfer_balance) +
                  amount,
              })
            } else {
              return updateById(id?.id, mockCaesarData, {
                ...id,
                cash_transfer_balance: id.cash_transfer_balance + amount,
              })
            }
          },
        },
      },
      {
        provide: CaesarBankService,
        useValue: {
          findOne: async (id) => {
            return findById(id, mockCaesarBankData)
          },
          pay: async (id: string | Partial<CaesarBank>, amount: number) => {
            if (typeof id === 'string') {
              return updateById(id, mockCaesarBankData, {
                balance: findById(id, mockCaesarBankData).balance + amount,
              })
            } else {
              return updateById(id?.id, mockCaesarBankData, {
                ...id,
                balance: id.balance + amount,
              })
            }
          },
        },
      },
      {
        provide: getRepositoryToken(CashTransfer),
        useValue: {
          create: async (newCashTransfer: Partial<CashTransfer>) => {
            return {
              id: randomUUID(),
              ...newCashTransfer,
            }
          },
          save: async (newCashTransferSave: Partial<CashTransfer>) => {
            const id = randomUUID()
            const saveValue = { id, ...(await newCashTransferSave) }
            mockCashTransfer.push(saveValue)
            return saveValue
          },
        },
      },
    ],
  }).compile()
  return module.get(CashTransferService)
}

describe('CashTransferService', () => {
  // const service = moduleInsantiate()
  let service
  beforeAll(async () => {
    service = await moduleInsantiate()
  })
  it('Service should be defined', () => {
    expect(service).toBeDefined()
  })
  const methods = ['deposit', 'withdraw', 'transfer', 'loan', 'loanPayment']
  it('Should have all methods ' + methods.join(', '), () => {
    methods.forEach((method) => {
      expect(service[method as keyof CashTransferService]).toBeDefined()
    })
  })
})

describe.only('\n[Withdraw]', () => {
  // const service = moduleInsantiate()
  let service: CashTransferService
  let withdrawResult: Partial<CashTransfer>
  let caesarBankFrom: Partial<CaesarBank>
  let caesarTo: Partial<Caesar>
  beforeAll(async () => {
    service = await moduleInsantiate()
    caesarBankFrom = updateById(mockCaesarBankData[0].id, mockCaesarBankData, {
      balance: 1000,
    })
    caesarTo = updateById(
      findById(caesarBankFrom.id, mockCaesarBankData).caesar.id,
      mockCaesarData,
      {
        cash_transfer_balance: 1000,
      },
    )
    // const caesarTo = caesarBankFrom.caesar

    const amount = 500
    withdrawResult = await service.withdraw({
      amount,
      as: CashTransferAs.WITHDRAW,
      to: caesarTo?.id,
      description: `${caesarTo?.id} withdraw ${amount}`,
      caesar_bank_from: caesarBankFrom.id,
      bank_fee: 0,
    })
  })
  it('Should withdraw correct amount [caesar_bank -> caesar]', async () => {
    expect(findById(caesarBankFrom.id, mockCaesarBankData).balance).toEqual(500)
  })
  it('Should have correct balance from [caesar_bank]', async () => {
    // expect(withdrawResult)

    expect(
      (findById(withdrawResult.id, mockCashTransfer) as CashTransfer)?.amount,
    ).toBe(500)
  })

  it('Should have deducted balance from [caesar] and [caesar_bank]', async () => {
    expect(findById(caesarTo.id, mockCaesarData).cash_transfer_balance).toEqual(
      500,
    )
  })
})

// describe('\n[Deposit]', () => {
//   let service: CashTransferService
//   beforeAll(async () => {
//     service = await moduleInsantiate()
//   })
// })
