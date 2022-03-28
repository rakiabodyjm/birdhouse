import { InjectRepository } from '@nestjs/typeorm'
import { CreateBankDto } from 'src/cash-transfer/dto/bank/create-bank.dto'
import { GetAllBankDto } from 'src/cash-transfer/dto/bank/get-all-bank.dto'
import { UpdateBankDto } from 'src/cash-transfer/dto/bank/update-bank.dto'
import { Bank } from 'src/cash-transfer/entities/bank.entity'
import paginateFind from 'src/utils/paginate'
import { Repository } from 'typeorm'

export class BankService {
  constructor(
    @InjectRepository(Bank) private bankRepository: Repository<Bank>,
  ) {}
  create(createBank: CreateBankDto) {
    const newBank = this.bankRepository.create(createBank)
    return this.bankRepository.save(newBank)
  }

  findOne(id: string) {
    return this.bankRepository.findOneOrFail(id).catch((err) => {
      throw new Error(err.message)
    })
  }

  findAll(getAllBanks: GetAllBankDto) {
    return paginateFind(this.bankRepository, getAllBanks)
  }

  update(updateBank: UpdateBankDto & { id: number }) {
    const bank = this.findOne(`${updateBank.id}`)
    const update: Partial<Bank> = {
      ...bank,
      ...updateBank,
    }
    return this.bankRepository.save(update)
  }

  deleteOne(id: number) {
    return this.bankRepository.delete(id)
  }

  deleteAll() {
    return this.bankRepository.clear()
  }
}
