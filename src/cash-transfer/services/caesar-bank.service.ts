import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToInstance } from 'class-transformer'
import { CaesarService } from 'src/caesar/caesar.service'
import { CreateCaesarBankDto } from 'src/cash-transfer/dto/caesar-bank/create-caesar-bank.dto'
import { GetAllCaesarBankDto } from 'src/cash-transfer/dto/caesar-bank/get-all-caesar-bank.dto'
import { UpdateCaesarBankDto } from 'src/cash-transfer/dto/caesar-bank/update-caesar-bank.dto'
import { CaesarBank } from 'src/cash-transfer/entities/caesar-bank.entity'
import { BankService } from 'src/cash-transfer/services/bank.service'
import paginateFind from 'src/utils/paginate'
import { FindOneOptions, Like, Repository } from 'typeorm'

@Injectable()
export class CaesarBankService {
  constructor(
    @InjectRepository(CaesarBank)
    private caesarBankRepo: Repository<CaesarBank>,
    private bankService: BankService,
    private caesarService: CaesarService,
  ) {}

  relations = [
    'caesar',
    'caesar.retailer',
    'caesar.admin',
    'caesar.subdistributor',
    'caesar.dsp',
    'caesar.user',
    'bank',
  ]

  findAll(getAllCaesarDto: GetAllCaesarBankDto) {
    const { caesar, bank, search } = getAllCaesarDto
    const searchQuery = search ? Like(`%${search}%`) : undefined
    const commonQuery = {
      ...(caesar && {
        caesar: caesar,
      }),
      ...(bank && {
        bank: bank,
      }),
    }

    /**
     * !!EMPHASIZE ORDER IS IMPORTANT FOR QUERYING OR SEARCHQUERY!!
     * !!BASED ON RELATIONSHIP ORDER!!
     */

    const finalQuery: FindOneOptions<CaesarBank>['where'] = searchQuery
      ? [
          {
            description: searchQuery,
            ...commonQuery,
          },
          {
            account_number: searchQuery,
            ...commonQuery,
          },
          {
            caesar: {
              retailer: {
                store_name: searchQuery,
              },
            },
            ...commonQuery,
          },
          {
            caesar: {
              admin: {
                name: searchQuery,
              },
            },
            ...commonQuery,
          },
          {
            caesar: {
              subdistributor: {
                name: searchQuery,
              },
            },
            ...commonQuery,
          },
          {
            caesar: {
              dsp: {
                dsp_code: searchQuery,
              },
            },
            ...commonQuery,
          },
          {
            caesar: {
              user: {
                first_name: searchQuery,
              },
            },
            ...commonQuery,
          },
          {
            caesar: {
              user: {
                last_name: searchQuery,
              },
            },
            ...commonQuery,
          },
        ]
      : commonQuery

    return paginateFind(
      this.caesarBankRepo,
      {
        page: getAllCaesarDto.page,
        limit: getAllCaesarDto.limit,
      },
      {
        where: finalQuery,
        relations: this.relations,
      },
    )
  }

  findOne(id: string) {
    return this.caesarBankRepo.findOneOrFail(id).catch((err) => {
      throw new Error(err.message)
    })
  }

  async create(createCaesarBank: CreateCaesarBankDto) {
    if (createCaesarBank.bank) {
      createCaesarBank.bank = await this.bankService.findOne(
        createCaesarBank.bank,
      )
    }
    if (createCaesarBank.caesar) {
      createCaesarBank.caesar = await this.caesarService.findOne(
        createCaesarBank.caesar,
      )
    }
    const newCaesarBank = this.caesarBankRepo.create(createCaesarBank)
    return this.caesarBankRepo.save(newCaesarBank)
  }

  async update(
    id: string,
    updatecaesarBank: UpdateCaesarBankDto & {
      balance?: number
    },
  ) {
    const caesarBank = await this.findOne(id)
    if (updatecaesarBank?.bank) {
      updatecaesarBank.bank = await this.bankService.findOne(
        updatecaesarBank.bank,
      )
    }
    if (updatecaesarBank?.caesar) {
      updatecaesarBank.caesar = await this.caesarService.findOne(
        updatecaesarBank.caesar,
      )
    }

    // const newCaesarBank = this.caesarBankRepo.create(createCaesarBank)
    return this.caesarBankRepo.save({
      ...caesarBank,
      ...updatecaesarBank,
    })
  }
  deleteOne(id: string) {
    return this.caesarBankRepo
      .softDelete(id)
      .catch((err) => {
        this.caesarBankRepo.softDelete(id).catch((Err) => {
          throw Err
        })
      })
      .catch((err) => {
        throw err
        // throw new Error(`Service Error`)
      })
  }

  deleteAll() {
    return this.caesarBankRepo.clear()
  }

  /**
   *
   * @param caesarBankId Caesar Bank ID
   * @param amount Amount in positive or negative values
   * @returns
   */
  async pay(caesarBankId: string | CaesarBank, amount: number) {
    let caesarBank: CaesarBank
    if (typeof caesarBankId === 'string') {
      caesarBank = await this.findOne(caesarBankId)
    } else {
      caesarBank = caesarBankId as CaesarBank
    }
    if (amount < 0) {
      if (caesarBank.balance < Math.abs(amount)) {
        throw new Error(`Insufficient Balance for this Caesar Bank`)
      }
    }
    return plainToInstance(
      CaesarBank,
      this.update(caesarBank.id, {
        balance: caesarBank.balance + amount,
      }),
    )
  }
}

// const caesarBankInitial: Partial<CaesarBank>[] = []
