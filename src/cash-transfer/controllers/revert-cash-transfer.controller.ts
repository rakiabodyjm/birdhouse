import {
  Controller,
  UseInterceptors,
  ClassSerializerInterceptor,
  BadRequestException,
  Body,
  Post,
  Get,
  Param,
} from '@nestjs/common'
import { Role } from 'src/auth/decorators/roles.decorator'
import { RolesGuard } from 'src/auth/guards/roles.guard'
import { CashTransferService } from 'src/cash-transfer/services/cash-transfer.service'
import { ErrorsInterceptor } from 'src/interceptors/error.interceptor'
import { Roles } from 'src/types/Roles'
import { CreateCashTransferDto } from '../dto/cash-transfer/create-cash-transfer.dto'
import { CreateLoanPaymentDto } from '../dto/cash-transfer/create-loan-payment.dto'
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
    return this.revertCashTransferService
      .transfer({
        // ...createCashTransferDto,
        ...(await this.cashTransferService.findOne(cashTransferId)),
      })
      .catch((err) => {
        throw new BadRequestException(err.message)
      })
  }

  @Post('withdraw')
  withdraw(@Body() createCashTransferDto: CreateCashTransferDto) {
    return this.revertCashTransferService.withdraw({
      ...createCashTransferDto,
    })
  }

  @Post('deposit')
  deposit(@Body() createCashTransferDto: CreateCashTransferDto) {
    return this.revertCashTransferService
      .deposit({
        ...createCashTransferDto,
      })
      .catch((err) => {
        throw new BadRequestException(err.message)
      })
  }

  @Post('loan')
  loan(@Body() CreateCashTransferDto: CreateCashTransferDto) {
    return this.revertCashTransferService.loan({
      ...CreateCashTransferDto,
    })
  }

  @Post('loan-payment')
  loanPayment(@Body() createLoanPayment: CreateLoanPaymentDto) {
    return this.revertCashTransferService.loanPayment(createLoanPayment)
  }

  @Get('loan-payments/:id')
  getLoanPayments(@Param('id') cashTransferId: string) {
    return this.revertCashTransferService.getLoanPayments(cashTransferId)
  }
}
