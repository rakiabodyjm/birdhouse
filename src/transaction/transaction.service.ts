import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { isNotEmptyObject } from 'class-validator'
import { AssetService } from 'src/asset/asset.service'
import Asset from 'src/asset/entities/asset.entity'
import { CaesarService } from 'src/caesar/caesar.service'
import { Caesar } from 'src/caesar/entities/caesar.entity'
import { DspService } from 'src/dsp/dsp.service'
import Inventory from 'src/inventory/entities/inventory.entity'
import { InventoryService } from 'src/inventory/inventory.service'
import { GetAllTransactionDto } from 'src/transaction/dto/get-all-transaction.dto'
import {
  Transaction,
  transactionAccountApprovals,
} from 'src/transaction/entities/transaction.entity'
import { PendingTransactionService } from 'src/transaction/pending-transaction.service'
import { Paginated } from 'src/types/Paginated'
import { SRPRoles, UserTypesAndUser } from 'src/types/Roles'
import paginateFind from 'src/utils/paginate'
import { Repository } from 'typeorm'

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    readonly transactionRepository: Repository<Transaction>,
    private caesarService: CaesarService,
    private inventoryService: InventoryService,
    private assetService: AssetService,
    private dspService: DspService,
    private pendingTransactionService: PendingTransactionService,
  ) {}

  relations = ['inventory_from', 'inventory_to', 'buyer', 'seller']

  findAll({
    page,
    limit,
    caesar,
    buyer,
    seller,
    inventory_from,
    inventory_to,
    inventory,
  }: GetAllTransactionDto): Promise<Paginated<Transaction> | Transaction[]> {
    const whereQuery = [
      ...(caesar && !buyer && !seller
        ? [
            {
              buyer: caesar,
            },
            {
              seller: caesar,
            },
          ]
        : []),
      ...(inventory && !inventory_from && !inventory_to
        ? [
            {
              inventory_from: inventory,
            },
            {
              inventory_to: inventory,
            },
          ]
        : []),

      inventory_from && {
        inventory_from,
      },
      inventory_to && {
        inventory_to,
      },
      buyer && {
        buyer,
      },
      seller && {
        seller,
      },
    ].filter((ea) => !!ea)

    return paginateFind(
      this.transactionRepository,
      {
        limit,
        page,
      },
      {
        where: whereQuery,
        relations: this.relations,
        order: {
          created_at: 'DESC',
        },
      },
    )
  }

  async createPurchase({
    buyer,
    inventory_from,
    quantity,
    pending_purchase_id,
    allow_credit,
  }: {
    buyer: string
    inventory_from: string
    quantity: number
    pending_purchase_id?: string
    allow_credit?: boolean
  }): Promise<Transaction> {
    try {
      const buyerCaesar = await this.caesarService.findOne(buyer)
      let inventoryToBeBought: Inventory = await this.inventoryService.findOne(
        inventory_from,
      )

      if (inventoryToBeBought.quantity < quantity) {
        throw new Error(`Inventory to be bought has insufficient quantity`)
      }

      const sellerCaesar = await this.caesarService.findOne(
        inventoryToBeBought.caesar.id,
      )
      const costPriceBuyer =
        inventoryToBeBought[SRPRoles[buyerCaesar.account_type]]
      if (!buyerCaesar?.data || !sellerCaesar?.data) {
        throw new Error('Cannot get Caesar Data of buyer')
      }

      /**
       * Create inventory of buyer
       * and make payment to seller
       */
      /**
       * verify that buyer has enough caesar_coins
       */
      if (!allow_credit) {
        await this.caesarService.findOne(buyerCaesar.id).then((cae) => {
          if (cae.data.caesar_coin < costPriceBuyer * quantity) {
            throw new Error(
              `Buyer does not have enough caesar_coins to purchase this item (Required: ${
                costPriceBuyer * quantity
              } CCoins, Wallet Of Buyer: ${cae.data.caesar_coin} CCoins)`,
            )
          }
        })
      }

      const newInventory = await this.inventoryService
        .create({
          asset: inventoryToBeBought.asset,
          caesar: buyerCaesar,
          quantity,
          unit_price: inventoryToBeBought[SRPRoles[buyerCaesar.account_type]],
        })
        .then(async (res) => {
          /**
           * make payment to seller after successfully adding to buyer's
           * inventory
           */
          const payment1 = await this.caesarService.pay(
            sellerCaesar,
            costPriceBuyer * quantity,
          )
          const payment2 = await this.caesarService.pay(
            buyerCaesar,
            -(costPriceBuyer * quantity),
          )
          return res
        })
        .then(async (res) => {
          /**
           * change inventory quantity of seller only
           *
           */
          inventoryToBeBought = await this.inventoryService
            .update(inventoryToBeBought.id, {
              quantity: inventoryToBeBought.quantity - quantity,
            })
            .catch(async (err) => {
              /**
               * reverse payment
               */
              err

              await this.caesarService
                .pay(sellerCaesar, -(costPriceBuyer * quantity))
                .catch((err) => {
                  err('Payment Reversal to seller failed to Execute')
                })
                .then(() => {
                  this.caesarService
                    .pay(buyerCaesar, costPriceBuyer * quantity)
                    .catch((err) => {
                      throw err
                    })
                })
              throw new Error(`Error Updating Inventory`)
            })

          return res
        })
        .catch((err) => {
          throw new Error(err.message)
        })

      const newTransaction: Partial<Transaction> = {
        buyer: buyerCaesar,
        seller: sellerCaesar,
        inventory_from: inventoryToBeBought,
        buying_account: buyerCaesar.account_type,
        selling_account: sellerCaesar.account_type,
        quantity,
        cost_price: inventoryToBeBought.unit_price * quantity,
        inventory_to: newInventory,
        sales_price: costPriceBuyer * quantity,
        seller_profit:
          costPriceBuyer * quantity - inventoryToBeBought.unit_price * quantity,
        selling_price: costPriceBuyer,
        unit_price: inventoryToBeBought.unit_price,

        /**
         *if fulfilled via pending_transaction
         */
        ...(pending_purchase_id && {
          pending_purchase_id,
        }),
      }

      const transactionCreate =
        this.transactionRepository.create(newTransaction)

      const transactionSave = await this.transactionRepository.save(
        transactionCreate,
      )

      return transactionSave
    } catch (err) {
      throw err
    }
  }

  findOne(id: string) {
    return this.transactionRepository.findOneOrFail(id).catch((err) => {
      throw new Error(err.message)
    })
  }

  // async generatePendingTransaction(transaction: Transaction) {
  //   const pendingTransactions = await this.verifyIfApprovalNeeded(
  //     transaction.inventory_from,
  //     transaction.buyer,
  //   )
  //   if (pendingTransactions) {
  //     await Promise.all(
  //       Object.keys(pendingTransactions).map(async (accountType) => {
  //         await this.pendingTransactionService.create({
  //           transaction,
  //           caesar: await this.caesarService.findOne(
  //             pendingTransactions[accountType],
  //           ),
  //         })
  //       }),
  //     )
  //   }
  // }

  // async verifyIfApprovalNeeded(
  //   inventoryParam: Inventory | Inventory['id'],
  //   caesarBuyerParam: Caesar | Caesar['id'],
  // ): Promise<false | Partial<Record<UserTypesAndUser, Caesar['id']>>> {
  //   try {
  //
  //     const inventory =
  //       typeof inventoryParam === 'string'
  //         ? await this.inventoryService.findOne(inventoryParam)
  //         : inventoryParam
  //     const caesar_buyer =
  //       typeof caesarBuyerParam === 'string'
  //         ? await this.caesarService.findOne(caesarBuyerParam)
  //         : caesarBuyerParam
  //     if (!inventory.asset.approval) {
  //       return false
  //     }

  //     const { account_type } = caesar_buyer

  //     const accountPermissions = this.whosePermission(
  //       account_type,
  //       JSON.parse(inventory.asset.approval),
  //     ) as UserTypesAndUser[]
  //     (accountPermissions)
  //     const caesarSeller = await this.caesarService.findOne(inventory.caesar.id)
  //     if (
  //       accountPermissions.length > 0 &&
  //       accountPermissions.includes(caesarSeller.account_type)
  //     ) {
  //       const returnResult: Partial<Record<UserTypesAndUser, string>> = {}

  //       await Promise.all(
  //         accountPermissions.map(async (currentAccountType) => {
  //           returnResult[currentAccountType] = caesarSeller.id

  //           if (
  //             currentAccountType === 'subdistributor' &&
  //             account_type === 'retailer' &&
  //             caesarSeller.dsp
  //           ) {
  //             returnResult['subdistributor'] = await this.dspService
  //               .findOne(caesarSeller.dsp.id)
  //               .then((res: Dsp): Subdistributor['id'] => {
  //                 return res.subdistributor.id
  //               })
  //               .then((res: Subdistributor['id']) => {
  //                 return this.caesarService.findOne({
  //                   subdistributor: res,
  //                 })
  //               })
  //               .then((subd) => subd.id)
  //               .catch((err) => {
  //                 throw new Error(err)
  //               })
  //           } else if (currentAccountType === caesarSeller.account_type) {
  //             returnResult[currentAccountType] = caesarSeller.id
  //           }
  //         }),
  //       )

  //       return isNotEmptyObject(returnResult) ? returnResult : false
  //     }
  //     return false
  //   } catch (err) {
  //     throw new Error(err)
  //   }
  // }

  async newVerifyIfApprovalNeeded(
    inventoryParam: Inventory['id'] | Inventory,
    caesarBuyerParam: Caesar['id'] | Caesar,
  ): Promise<Partial<Record<UserTypesAndUser, Caesar>> | false> {
    const inventory =
      typeof inventoryParam === 'string'
        ? await this.inventoryService.findOne(inventoryParam)
        : inventoryParam
    const caesar_buyer =
      typeof caesarBuyerParam === 'string'
        ? await this.caesarService.findOne(caesarBuyerParam)
        : caesarBuyerParam

    const permissions = this.whosePermission(
      caesar_buyer.account_type,
      JSON.parse(inventory.asset.approval),
    )

    const caesarOwner = await this.caesarService.findOne(inventory.caesar.id)

    const accountPermissionCaesars: Partial<Record<UserTypesAndUser, Caesar>> =
      {}

    if (permissions.length > 0) {
      await Promise.all(
        permissions.map(async (accountPermission) => {
          if (
            accountPermission === 'subdistributor' &&
            caesarOwner.account_type === 'dsp'
          ) {
            accountPermissionCaesars['subdistributor'] = await this.dspService
              .findOne(caesarOwner.dsp.id)
              .then((res) => {
                return this.caesarService.findOne({
                  subdistributor: res.subdistributor.id,
                })
              })
            return
          }
          if (accountPermission === caesarOwner.account_type) {
            accountPermissionCaesars[accountPermission] = caesarOwner
          }
        }),
      )
      const returnObject = isNotEmptyObject(accountPermissionCaesars)
        ? accountPermissionCaesars
        : false
      return returnObject
    } else {
      return false
    }
  }
  private whosePermission(
    accountType: UserTypesAndUser,
    permissions: Asset['approval'][] | null,
  ): UserTypesAndUser[] {
    if (!permissions || !(permissions?.length > 0)) {
      return []
    }
    const indexOfAccountInHierarchy = [...transactionAccountApprovals].indexOf(
      accountType,
    )

    /**
     * gets higher account in hierarchy
     */
    const bosses = transactionAccountApprovals.slice(
      0,
      indexOfAccountInHierarchy,
    )

    // (
    //   'bosses',
    //   bosses,
    //   'indexOfAccountInHierarchy',
    //   indexOfAccountInHierarchy,
    // )
    let toGiveApproval: UserTypesAndUser[] = []
    if (bosses && bosses.length > 0) {
      permissions.forEach((permission) => {
        if (bosses.includes(permission as UserTypesAndUser)) {
          toGiveApproval = [...toGiveApproval, permission as UserTypesAndUser]
        }
      })
    }

    //give sorted
    return toGiveApproval.sort((a, b) => {
      return bosses.indexOf(a) - bosses.indexOf(b)
    })
  }
}
