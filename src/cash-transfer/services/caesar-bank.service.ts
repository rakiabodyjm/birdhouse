import { InjectRepository } from '@nestjs/typeorm'
import { CaesarService } from 'src/caesar/caesar.service'
import { CreateCaesarBankDto } from 'src/cash-transfer/dto/caesar-bank/create-caesar-bank.dto'
import { GetAllCaesarBankDto } from 'src/cash-transfer/dto/caesar-bank/get-all-caesar-bank.dto'
import { UpdateCaesarBankDto } from 'src/cash-transfer/dto/caesar-bank/update-caesar-bank.dto'
import { CaesarBank } from 'src/cash-transfer/entities/caesar-bank.entity'
import { BankService } from 'src/cash-transfer/services/bank.service'
import paginateFind from 'src/utils/paginate'
import { Repository } from 'typeorm'

export class CaesarBankService {
  constructor(
    @InjectRepository(CaesarBank)
    private caesarBankRepo: Repository<CaesarBank>,
    private bankService: BankService,
    private caesarService: CaesarService,
  ) {}

  findAll(getAllCaesarDto: GetAllCaesarBankDto) {
    return paginateFind(
      this.caesarBankRepo,
      {
        page: getAllCaesarDto.page,
        limit: getAllCaesarDto.limit,
      },
      {
        where: {
          ...(getAllCaesarDto.caesar && {
            caesar: getAllCaesarDto.caesar,
          }),
          ...(getAllCaesarDto.bank && {
            bank: getAllCaesarDto.bank,
          }),
        },
      },
    )
  }

  findOne(id: number) {
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

  async update(id: number, updatecaesarBank: UpdateCaesarBankDto) {
    const caesarBank = await this.findOne(id)
    if (updatecaesarBank.bank) {
      updatecaesarBank.bank = await this.bankService.findOne(
        updatecaesarBank.bank,
      )
    }
    if (updatecaesarBank.caesar) {
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
  deleteOne(id: number) {
    return this.caesarBankRepo.delete(id)
  }

  deleteAll() {
    return this.caesarBankRepo.clear()
  }
}
