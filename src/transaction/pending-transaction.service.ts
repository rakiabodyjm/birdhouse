import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToClass } from 'class-transformer'
import { CaesarService } from 'src/caesar/caesar.service'
import { Caesar } from 'src/caesar/entities/caesar.entity'
import Inventory from 'src/inventory/entities/inventory.entity'
import GetAllPendingTransactionDto from 'src/transaction/dto/get-all-pending-transaction.dto'
import { PendingTransaction } from 'src/transaction/entities/pending-transaction.entity'
import { Transaction } from 'src/transaction/entities/transaction.entity'
import { TransactionService } from 'src/transaction/transaction.service'
import paginateFind from 'src/utils/paginate'
import { Repository } from 'typeorm'

@Injectable()
export class PendingTransactionService {
  constructor(
    @InjectRepository(PendingTransaction)
    private pendingTransactionRepo: Repository<PendingTransaction>,
    @Inject(forwardRef(() => TransactionService))
    private transactionService: TransactionService,
    @InjectRepository(Transaction)
    private transactionRepo: Repository<Transaction>,
    private caesarService: CaesarService,
  ) {}

  // private transactionService: TransactionService

  // onModuleInit() {
  //   this.transactionService = this.moduleRef.get(TransactionService)
  //   console.log(this.transactionService)
  // }
  relations: (keyof PendingTransaction)[] = [
    'inventory',
    'caesar_buyer',
    'caesar_seller',
  ]

  findAll({
    page,
    limit,
    caesar_buyer,
    caesar_seller,
    withDeleted,
    approved,
  }: GetAllPendingTransactionDto) {
    return paginateFind(
      this.pendingTransactionRepo,
      {
        page,
        limit,
      },
      {
        order: {
          created_at: 'DESC',
        },
        // ...(caesar && {
        //   caesar: {
        //     id: caesar,
        //   },
        // }),
        where: {
          ...(caesar_buyer && {
            caesar_buyer: {
              id: caesar_buyer,
            },
          }),
          ...(caesar_seller && {
            caesar_seller: {
              id: caesar_seller,
            },
          }),
          ...(approved && {
            approved,
          }),
        },
        relations: this.relations,
        ...(withDeleted && {
          withDeleted: true,
        }),
      },
    ).then(async (res) => {
      return {
        ...res,
        data: await this.injectPendingTransactionWithCaesar(res.data),
      }
    })
  }

  async injectPendingTransactionWithCaesar<T = PendingTransaction>(
    pendingTransaction: T,
  ): Promise<T>
  async injectPendingTransactionWithCaesar<T = PendingTransaction[]>(
    pendingTransaction: T[],
  ): Promise<T>
  async injectPendingTransactionWithCaesar(pendingTransaction: unknown) {
    if (!Array.isArray(pendingTransaction)) {
      const pt = { ...(pendingTransaction as PendingTransaction) }
      return {
        ...pt,
        caesar_buyer: await this.caesarService.findOne(pt.caesar_buyer.id),
        caesar_seller: await this.caesarService.findOne(pt.caesar_seller.id),
      } as PendingTransaction
    } else if (Array.isArray(pendingTransaction)) {
      return await Promise.all(
        pendingTransaction.map((ea) =>
          this.injectPendingTransactionWithCaesar(ea),
        ),
      )
    } else {
      throw new Error(`Not of accepted type`)
    }
  }

  create({
    caesar_buyer,
    caesar_seller,
    inventory,
    quantity,
    pending_purchase_id,
  }: {
    caesar_buyer: Caesar
    caesar_seller: Caesar
    inventory: Inventory
    quantity: number
    pending_purchase_id: string
  }) {
    const create = this.pendingTransactionRepo.create({
      caesar_buyer,
      caesar_seller,
      inventory,
      quantity,
      pending_purchase_id,
    })

    return this.pendingTransactionRepo.save(create)
  }

  async findOne(id: string) {
    const query = await this.pendingTransactionRepo
      .findOneOrFail(id, {
        relations: this.relations,
      })
      .then((res) => this.injectPendingTransactionWithCaesar(res))
    return query
  }

  update(
    pendingTransaction: PendingTransaction | PendingTransaction['id'],
    updateValues: Partial<PendingTransaction>,
  ) {
    return this.findOne(
      typeof pendingTransaction === 'string'
        ? pendingTransaction
        : pendingTransaction['id'],
    )
      .then((pendingTransacToBeUpdated) => {
        return this.pendingTransactionRepo.save(
          plainToClass(PendingTransaction, {
            ...pendingTransacToBeUpdated,
            ...updateValues,
          }),
        )
      })
      .catch((err) => {
        throw err
      })
  }

  async approvePendingTransaction(
    pendingTransaction: PendingTransaction | PendingTransaction['id'],
  ): Promise<PendingTransaction & { transaction?: Transaction }> {
    try {
      let pending_transaction: PendingTransaction

      if (typeof pendingTransaction === 'string') {
        pending_transaction = await this.findOne(pendingTransaction)
      } else {
        pending_transaction = pendingTransaction
      }

      /**
       * mark current pending transaction as complete
       */
      const updatedPendingTransaction = await this.update(pendingTransaction, {
        approved: true,
      })

      /**
       * get all with the same pending_purchase_id
       */
      const pendingTransactionPeers =
        await this.getDuplicatePendingTransactions(
          updatedPendingTransaction['id'],
        )

      const isReadyForTransaction = await this.isReadyForTransaction(
        pendingTransactionPeers,
      )

      /**
       * ready to create as purchase
       */
      if (isReadyForTransaction) {
        /**
         * Look for duplicate in transactions
         */
        await this.transactionRepo
          .findOneOrFail({
            pending_purchase_id: pending_transaction.pending_purchase_id,
          })
          .then(() => {
            throw new Error(`Transaction already finished`)
          })
          .catch(() => {
            return false
          })

        const transaction = await this.transactionService
          .createPurchase({
            buyer: pending_transaction.caesar_buyer.id,
            inventory_from: pending_transaction.inventory.id,
            quantity: pending_transaction.quantity,
            pending_purchase_id: updatedPendingTransaction.pending_purchase_id,
          })
          .then((res) => {
            /**
             * mark everyone as complet and tie to transactionc reated
             */
            return Promise.all(
              pendingTransactionPeers.map((pendingTransaction) => {
                this.update(pendingTransaction.id, {
                  transaction_id: res,
                })
              }),
            )
              .then(() => {
                return res
              })
              .catch((err) => {
                console.log('Failed updating all pendingTransactionPeers')
                throw err
              })

            // return res
          })
          .catch((err) => {
            console.log(err)
            throw err
          })

        return {
          ...updatedPendingTransaction,
          transaction,
        }
      }
      return updatedPendingTransaction
    } catch (err) {
      throw err
    }
  }

  private async getDuplicatePendingTransactions(
    id: PendingTransaction['id'],
    /**
     * Ignores passed transaction parameter in return transactions array
     */
    ignoreCurrent?:
      | true
      | {
          ignoreCurrent: true
        },
  ) {
    return await this.pendingTransactionRepo
      .findOneOrFail(id)
      .then((pendingTransaction) => {
        return this.pendingTransactionRepo.find({
          pending_purchase_id: pendingTransaction.pending_purchase_id,
        })
      })
      .then((res) => {
        if (ignoreCurrent) {
          return res.filter((fi) => fi.id != id)
        }
        return res
      })
      .catch((err) => {
        throw err
      })
  }
  private async isReadyForTransaction(
    pendingTransactions: PendingTransaction[],
  ) {
    return !pendingTransactions.some((element) => element.approved === false)
  }

  async cancelPendingTransaction(id: string) {
    const pendingTransaction = await this.findOne(id)
    const duplicates = await this.getDuplicatePendingTransactions(id)
    if (duplicates?.length > 0) {
      await Promise.all(
        duplicates.map(async (ea) => {
          await this.pendingTransactionRepo.softDelete(ea)
        }),
      )
        .then((res) => {
          return 'Cancelled ' + res.length + 'Pending Transactions'
        })
        .catch((err) => {
          throw new Error(err)
        })
      return `Pending Transaction/s Cancelled`
    }
    if (pendingTransaction.approved) {
      throw new Error(`Pending Transaction is already approved`)
    }

    await this.pendingTransactionRepo.softDelete(id)
    return pendingTransaction
  }
  async denyPendingTransaction(id: string) {
    const pendingTransaction = await this.findOne(id)

    if (!pendingTransaction.approved) {
      throw new Error(`Pending Transaction is already approved`)
    }
    return this.pendingTransactionRepo.save({
      ...pendingTransaction,
      approved: true,
    })
  }
}
