import {
  Controller,
  UseInterceptors,
  ClassSerializerInterceptor,
  BadRequestException,
  Post,
  Get,
  Param,
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

  @Post('transfer/:id')
  async transfer(@Param('id') cashTransferId: string) {
    console.log(this.cashTransferService.findOne(cashTransferId))
    return this.revertCashTransferService
      .transfer({
        // ...createCashTransferDto,
        ...(await this.cashTransferService.findOne(cashTransferId)),
      })
      .catch((err) => {
        throw new BadRequestException(err.message)
      })
  }

  @Post('withdraw/:id')
  async withdraw(@Param('id') cashTransferId: string) {
    console.log({ ...(await this.cashTransferService.findOne(cashTransferId)) })
    return this.revertCashTransferService
      .withdraw({ ...(await this.cashTransferService.findOne(cashTransferId)) })
      .catch((err) => {
        throw new BadRequestException(err.message)
      })
  }

  // @Post('deposit/:id')
  // async deposit(@Param('id') cashTransferId: string) {
  //   return this.revertCashTransferService
  //     .deposit({
  //       ...(await this.cashTransferService.findOne(cashTransferId)),
  //     })
  //     .catch((err) => {
  //       throw new BadRequestException(err.message)
  //     })
  // }

  @Post('loan/:id')
  async loan(@Param('id') cashTransferId: string) {
    return this.revertCashTransferService
      .loan({
        ...(await this.cashTransferService.findOne(cashTransferId)),
      })
      .catch((err) => {
        throw new BadRequestException(err.message)
      })
  }

  // @Post('loan-payment/:id')
  // loanPayment(@Param('id') cashTransferId: string) {
  //   return this.revertCashTransferService.loanPayment({
  //       ...(await this.cashTransferService.findOne(cashTransferId)),
  //     })
  //     .catch((err) => {
  //       throw new BadRequestException(err.message)
  //     }))
  // }

  @Get('loan-payments/:id')
  getLoanPayments(@Param('id') cashTransferId: string) {
    return this.revertCashTransferService.getLoanPayments(cashTransferId)
  }
}
