import {
  BadRequestException,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiTags } from '@nestjs/swagger'
import { ApprovePendingTransactionDto } from 'src/transaction/dto/approve-pending-transaction.dto'
import { CancelPendingTransactionDto } from 'src/transaction/dto/cancel-pending-transaction.dto'
import GetAllPendingTransactionDto from 'src/transaction/dto/get-all-pending-transaction.dto'
import { PendingTransactionService } from 'src/transaction/pending-transaction.service'
import { createEntityMessage } from 'src/types/EntityMessage'

@ApiTags('Pending Transaction Routes')
@Controller('pending-transaction')
@UseInterceptors(ClassSerializerInterceptor)
export default class PendingTransactionController {
  constructor(
    private readonly pendingTransactionService: PendingTransactionService,
  ) {}

  @Get(':id')
  findOne(@Param() id: string) {
    return this.pendingTransactionService.findOne(id)
  }

  @Get()
  findAll(@Query() getAllPendingTransactionDto: GetAllPendingTransactionDto) {
    console.log('getAllPendingTransactionDto', getAllPendingTransactionDto)
    return this.pendingTransactionService.findAll(getAllPendingTransactionDto)
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('approve-transaction/:pending_transaction_id')
  async approveTransaction(
    @Param('pending_transaction_id') id: ApprovePendingTransactionDto['id'],
  ) {
    try {
      const returner = await this.pendingTransactionService
        .approvePendingTransaction(id)
        .then((response) => {
          if (response?.transaction) {
            return createEntityMessage(
              response,
              `Pending Transaction proceed as Transaction`,
            )
          }
          return createEntityMessage(response, `Pending Transaction Approved`)
        })
        .catch((err) => {
          console.log(err)
          throw new InternalServerErrorException(err)
        })
      return returner
    } catch (err) {
      throw new BadRequestException(err)
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('cancel-transaction/:id')
  async cancelTransaction(
    @Param()
    pendingTransaction: CancelPendingTransactionDto,
  ) {
    return this.pendingTransactionService
      .cancelPendingTransaction(pendingTransaction.id)
      .then((res) =>
        createEntityMessage(
          res,
          `Pending Transaction ${pendingTransaction.id} Cancelled`,
        ),
      )
      .catch((err) => {
        console.log(err)

        throw new BadRequestException(err.message)
      })
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('deny-transaction/:id')
  async denyTransaction(
    @Param()
    pendingTransaction: CancelPendingTransactionDto,
  ) {
    return this.pendingTransactionService
      .cancelPendingTransaction(pendingTransaction.id)
      .then((res) =>
        createEntityMessage(
          res,
          `Pending Transaction ${pendingTransaction.id} Denied`,
        ),
      )
      .catch((err) => {
        console.log(err)

        throw new BadRequestException(err.message)
      })
  }
}
