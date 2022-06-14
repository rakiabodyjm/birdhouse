import { CashTransferAs } from 'src/cash-transfer/entities/cash-transfer.entity'
import {
  Controller,
  UseInterceptors,
  ClassSerializerInterceptor,
  BadRequestException,
  Post,
  Get,
  Param,
  Query,
} from '@nestjs/common'
import { CashTransferService } from 'src/cash-transfer/services/cash-transfer.service'
import { ErrorsInterceptor } from 'src/interceptors/error.interceptor'
import { RevertCashTransferService } from '../services/revert-cash-transfer.service'

@Controller('cash-transfer/revert')
// @Role(Roles.ADMIN)
// @UseGuards(RolesGuard)
@UseInterceptors(ErrorsInterceptor, ClassSerializerInterceptor)
export class RevertCashTransferController {
  constructor(
    private readonly revertCashTransferService: RevertCashTransferService,
    private readonly cashTransferService: CashTransferService,
  ) {}

  @Get('/')
  async findAll(@Query() getAllRevertCashTransfer: { as: CashTransferAs }) {
    return this.findAll(getAllRevertCashTransfer)
  }

  @Post('/:id')
  async revert(@Param('id') id: string) {
    console.log(this.cashTransferService.findOne(id))
    return this.revertCashTransferService
      .revert({ ...(await this.cashTransferService.findOne(id)) })
      .catch((err) => {
        throw new BadRequestException(err.message)
      })
  }

  @Get('loan-payments/:id')
  getLoanPayments(@Param('id') cashTransferId: string) {
    return this.revertCashTransferService.getLoanPayments(cashTransferId)
  }
}
