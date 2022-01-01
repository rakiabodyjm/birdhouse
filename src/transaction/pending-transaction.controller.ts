import {
  BadRequestException,
  ClassSerializerInterceptor,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ApprovePendingTransactionDto } from 'src/transaction/dto/approve-pending-transaction.dto'
import GetAllPendingTransactionDto from 'src/transaction/dto/get-all-pending-transaction.dto'
import { PendingTransactionService } from 'src/transaction/pending-transaction.service'
import { TransactionService } from 'src/transaction/transaction.service'

@ApiTags('Pending Transaction Routes')
@Controller('pending-transaction')
@UseInterceptors(ClassSerializerInterceptor)
export default class PendingTransactionController {
  constructor(
    private readonly pendingTransactionService: PendingTransactionService,
  ) {}
  @Get()
  findAll(@Query() getAllPendingTransactionDto: GetAllPendingTransactionDto) {
    console.log('getAllPendingTransactionDto', getAllPendingTransactionDto)
    return this.pendingTransactionService.findAll(getAllPendingTransactionDto)
  }

  // @UseGuards(AuthGuard('jwt'))
  @Post('approve-transaction/:pending_transaction_id')
  async approveTransaction(
    @Param('pending_transaction_id') id: ApprovePendingTransactionDto['id'],
  ) {
    try {
      const returner = await this.pendingTransactionService
        .approvePendingTransaction(id)
        .catch((err) => {
          throw new InternalServerErrorException(err)
        })
      return returner

      return returner
    } catch (err) {
      throw new BadRequestException(err)
    }
  }
}
