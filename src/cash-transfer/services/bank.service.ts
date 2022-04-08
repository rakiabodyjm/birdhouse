import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CreateBankDto } from 'src/cash-transfer/dto/bank/create-bank.dto'
import { GetAllBankDto } from 'src/cash-transfer/dto/bank/get-all-bank.dto'
import { UpdateBankDto } from 'src/cash-transfer/dto/bank/update-bank.dto'
import { Bank } from 'src/cash-transfer/entities/bank.entity'
import { CaesarBank } from 'src/cash-transfer/entities/caesar-bank.entity'
import paginateFind from 'src/utils/paginate'
import { Like, Repository } from 'typeorm'

@Injectable()
export class BankService {
  constructor(
    @InjectRepository(Bank) private bankRepository: Repository<Bank>,
    @InjectRepository(CaesarBank)
    private caesarBankRepository: Repository<CaesarBank>,
  ) {}
  async create(createBank: CreateBankDto) {
    const newBank = this.bankRepository.create(createBank)

    return this.bankRepository.save(newBank).then(async (res) => {
      await this.caesarBankRepository.save({
        bank: res,
        caesar: null,
        description: `${res.description} Fees`,
      })
      return res
    })
  }

  findOne(id: string) {
    return this.bankRepository.findOneOrFail(id).catch((err) => {
      throw new Error(err.message)
    })
  }

  findAll(getAllBanks: GetAllBankDto) {
    return paginateFind(this.bankRepository, getAllBanks, {
      ...(getAllBanks.search && {
        where: [
          {
            name: Like(`%${getAllBanks.search}%`),
          },
          {
            description: Like(`%${getAllBanks.search}%`),
          },
        ],
      }),
    })
  }

  update(updateBank: UpdateBankDto & { id: number }) {
    const bank = this.findOne(`${updateBank.id}`)
    const update: Partial<Bank> = {
      ...bank,
      ...updateBank,
    }
    return this.bankRepository.save(update).then((res) => {
      return res
    })
  }

  deleteOne(id: number) {
    this.caesarBankRepository
      .findOneOrFail({
        where: {
          bank: id,
        },
      })
      .catch((err) => {
        return null
      })
      .then((res) => {
        if (res) {
          return this.caesarBankRepository.delete(res.id)
        }
        return null
      })
      .then(() => {
        return this.bankRepository.delete(id)
      })
      .catch((err) => {
        throw err.message
      })
  }

  deleteAll() {
    return this.bankRepository.clear()
  }

  async init() {
    return await Promise.all(
      initialBanks.map(async (ea, index) => {
        return await this.bankRepository.save({
          id: index + 1,
          ...ea,
        })
      }),
    )
  }
}

const initialBanks: Partial<Bank>[] = [
  {
    name: 'BDO',
    description: 'Banco De Oro',
  },
  {
    name: 'GCASH',
    description: 'Mynt (Globe Fintech)',
  },
  {
    name: 'PAYMAYA',
    description: 'PayMaya Enterprise',
  },
  {
    name: 'CIMB',
    description: 'CIMB Group Holdings Berhad',
  },
  {
    name: 'GRABPAY',
    description: 'Grab Philippines',
  },
]
