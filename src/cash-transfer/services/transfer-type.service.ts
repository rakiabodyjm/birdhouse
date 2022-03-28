import { InjectRepository } from '@nestjs/typeorm'
import { CreateTransferTypeDto } from 'src/cash-transfer/dto/transfer-type/create-transfer-type.dto'
import { GetAllTransferTypeDto } from 'src/cash-transfer/dto/transfer-type/get-all-transfer-type.dto'
import { UpdateTransferTypeDto } from 'src/cash-transfer/dto/transfer-type/update-transfer-type.dto'
import { TransferType } from 'src/cash-transfer/entities/transfer-type.entity'
import paginateFind from 'src/utils/paginate'
import { Repository } from 'typeorm'

export class TransferTypeService {
  constructor(
    @InjectRepository(TransferType)
    private transferTypeRepo: Repository<TransferType>,
  ) {}
  create(createTransferType: CreateTransferTypeDto) {
    const newTransferType = this.transferTypeRepo.create(createTransferType)
    return this.transferTypeRepo.save(newTransferType)
  }

  findOne(id: number) {
    return this.transferTypeRepo.findOneOrFail(id).catch((err) => {
      throw new Error(err.message)
    })
  }

  update(id: number, updateTransferType: UpdateTransferTypeDto) {
    return this.findOne(id)
      .then((res) => {
        this.transferTypeRepo
          .save({
            ...res,
            ...updateTransferType,
          })
          .catch((err) => {
            throw new Error(err.message)
          })
      })
      .catch((err) => {
        throw new Error(err.message)
      })
  }

  findAll(getAllTransferType?: GetAllTransferTypeDto) {
    return paginateFind(this.transferTypeRepo, getAllTransferType)
  }

  deleteOne(id: number) {
    return this.transferTypeRepo.delete(id)
  }

  deleteAll() {
    return this.transferTypeRepo.clear()
  }
}
