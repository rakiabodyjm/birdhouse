import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CreateTransferTypeDto } from 'src/cash-transfer/dto/transfer-type/create-transfer-type.dto'
import { GetAllTransferTypeDto } from 'src/cash-transfer/dto/transfer-type/get-all-transfer-type.dto'
import { UpdateTransferTypeDto } from 'src/cash-transfer/dto/transfer-type/update-transfer-type.dto'
import { TransferType } from 'src/cash-transfer/entities/transfer-type.entity'
import paginateFind from 'src/utils/paginate'
import { Repository } from 'typeorm'

@Injectable()
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
    return this.transferTypeRepo.find().then((res) => {
      return Promise.all(
        res.map((ea) => {
          this.transferTypeRepo.delete(ea)
        }),
      )
    })
    // return this.transferTypeRepo.delete()
  }

  async init() {
    return await Promise.all(
      transferTypeData.map((ea) => {
        this.transferTypeRepo.save(ea)
      }),
    )
  }
}

const transferTypeData = [
  {
    id: 1,
    name: 'TRANSFER',
    description: 'Transfer from Bank Account to another Bank Account',
  },
  {
    id: 2,
    name: 'DEPOSIT',
    description: 'Transfer from Person to Bank Account',
  },
  {
    id: 3,
    name: 'WITHDRAW',
    description: 'Transfer from Bank Account to Person',
  },
]
// const tranferTypeData = [
//   {
//     id: 1,
//     name: 'DEPOSIT',
//     description: null,
//   },
//   {
//     id: 2,
//     name: 'TRANSFER',
//     description: null,
//   },
//   {
//     id: 3,
//     name: 'LOAN',
//     description: null,
//   },
//   {
//     id: 4,
//     name: 'PAYMENT',
//     description: null,
//   },
//   {
//     id: 5,
//     name: 'WITHDRAWAL',
//     description: null,
//   },
//   {
//     id: 6,
//     name: 'INTEREST',
//     description: null,
//   },
//   {
//     id: 7,
//     name: 'FEES',
//     description: null,
//   },
//   {
//     id: 8,
//     name: 'DISCOUNT',
//     description: null,
//   },
//   {
//     id: 9,
//     name: 'REWARDS',
//     description: null,
//   },
//   {
//     id: 10,
//     name: 'BONUS',
//     description: null,
//   },
//   {
//     id: 11,
//     name: 'PENALTY',
//     description: null,
//   },
// ]
