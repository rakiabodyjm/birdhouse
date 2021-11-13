import { Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { InventoryService } from 'src/inventory/inventory.service'
import { Transaction } from 'src/transaction/entities/transaction.entity'
import { Repository } from 'typeorm'
import { CreateTransactionDto } from './dto/create-transaction.dto'
import { UpdateTransactionDto } from './dto/update-transaction.dto'

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    readonly transactionRepository: Repository<Transaction>,
    inventoryService: InventoryService,
  ) {}

  // create(createTransactionDto: CreateTransactionDto) {
  //   // return 'This action adds a new transaction';
  // }

  // findAll() {
  //   return `This action returns all transaction`
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} transaction`
  // }

  // update(id: number, updateTransactionDto: UpdateTransactionDto) {
  //   return `This action updates a #${id} transaction`
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} transaction`
  // }
}
