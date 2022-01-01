import {
  Controller,
  Post,
  Param,
  UseInterceptors,
  ClassSerializerInterceptor,
  Get,
  Query,
  Body,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common'
import { TransactionService } from './transaction.service'
import {
  PurchaseTransactionBodyDto,
  PurchaseTransactionParamsDto,
} from 'src/transaction/dto/purchase-transaction.dto'
import { GetAllTransactionDto } from 'src/transaction/dto/get-all-transaction.dto'
import { ApiTags } from '@nestjs/swagger'
import { PendingTransactionService } from 'src/transaction/pending-transaction.service'
import { CaesarService } from 'src/caesar/caesar.service'
import { InventoryService } from 'src/inventory/inventory.service'
import { PendingTransaction } from 'src/transaction/entities/pending-transaction.entity'
import { Transaction } from 'src/transaction/entities/transaction.entity'
import { v4 } from 'uuid'
import { UserTypesAndUser } from 'src/types/Roles'
import { Caesar } from 'src/caesar/entities/caesar.entity'
@ApiTags('Transaction Routes')
@Controller('transaction')
@UseInterceptors(ClassSerializerInterceptor)
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly pendingTranasctionService: PendingTransactionService,
    private readonly caesarService: CaesarService,
    private readonly inventoryService: InventoryService,
  ) {}

  @Get()
  findAll(@Query() getAllTransactionDto: GetAllTransactionDto) {
    return this.transactionService.findAll(getAllTransactionDto)
  }

  @Post('/purchase/:inventory_from/:buyer')
  async purchase(
    @Param() purchaseParams: PurchaseTransactionParamsDto,
    @Body() purchaseBody: PurchaseTransactionBodyDto,
  ): Promise<{
    transaction?: Transaction
    pending_transactions?: PendingTransaction[]
  }> {
    try {
      const { buyer, inventory_from } = purchaseParams
      const { quantity } = purchaseBody
      /**
       * reduce approvals into caesar.id's
       */
      const approvals: Partial<Record<UserTypesAndUser, Caesar['id']>> =
        await this.transactionService
          .newVerifyIfApprovalNeeded(inventory_from, buyer)
          .then((res) => {
            return Object.keys(res).reduce((acc, caesarType) => {
              return {
                ...acc,
                [caesarType as UserTypesAndUser]: (res[caesarType] as Caesar)
                  .id,
              }
            }, {})
          })
      if (approvals) {
        const inventory = await this.inventoryService.findOne(inventory_from)

        const caesar_buyer = await this.caesarService.findOne(buyer)
        /**
         * generate unique purchase_id
         */
        const pending_purchase_id = v4()
        return {
          pending_transactions: await Promise.all(
            Object.keys(approvals).map(async (accountType) => {
              const create = {
                caesar_buyer,
                caesar_seller: await this.caesarService.findOne(
                  approvals[accountType],
                ),
                inventory,
                quantity,
                pending_purchase_id,
              }
              return await this.pendingTranasctionService.create(create)
            }),
          ),
        }
      }
      /**
       * TODO Create custom validation for cases as this
       */
      return {
        transaction: await this.transactionService
          .createPurchase({
            buyer,
            inventory_from,
            quantity,
          })
          .then((res) => ({
            ...res,
            transaction_pending: false,
          }))
          .catch((err) => {
            throw new BadRequestException(err.message)
          }),
      }
    } catch (err) {
      throw new BadRequestException(err)
    }
  }

  @Get(':id')
  findOne(@Param('id') transaction_id) {
    return this.transactionService.findOne(transaction_id).catch((err) => {
      throw new NotFoundException(err.message)
    })
  }

  @Post('test-verify-approval')
  async verifyApproval(
    @Body()
    { caesar_buyer, inventory }: { caesar_buyer: string; inventory: string },
  ) {
    return await this.transactionService.newVerifyIfApprovalNeeded(
      inventory,
      caesar_buyer,
    )
  }
}
