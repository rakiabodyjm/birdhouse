import { CreateLoanPaymentDto } from './../dto/cash-transfer/create-loan-payment.dto'
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
  BadRequestException,
} from '@nestjs/common'
import { CashTransferService } from 'src/cash-transfer/services/cash-transfer.service'
import { CreateCashTransferDto } from 'src/cash-transfer/dto/cash-transfer/create-cash-transfer.dto'
import { UpdateCashTransferDto } from 'src/cash-transfer/dto/cash-transfer/update-cash-transfer.dto'
import { GetAllCashTransferDto } from 'src/cash-transfer/dto/cash-transfer/get-all-cash-transfer.dto'
import { ErrorsInterceptor } from 'src/interceptors/error.interceptor'

@Controller('cash-transfer')
@UseInterceptors(ErrorsInterceptor, ClassSerializerInterceptor)
export class CashTransferController {
  constructor(private readonly cashTransferService: CashTransferService) {}

  @Get()
  findAll(@Query() getAllCashTransfer: GetAllCashTransferDto) {
    return this.cashTransferService.findAll(getAllCashTransfer)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cashTransferService.findOne(id)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCashTransferDto: UpdateCashTransferDto,
  ) {
    return this.cashTransferService.update(id, updateCashTransferDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cashTransferService.delete(id)
  }

  @Post('transfer')
  transfer(@Body() createCashTransferDto: CreateCashTransferDto) {
    return this.cashTransferService
      .transfer({
        ...createCashTransferDto,
      })
      .catch((err) => {
        throw new BadRequestException(err.message)
      })
  }

  @Post('withdraw')
  withdraw(@Body() createCashTransferDto: CreateCashTransferDto) {
    return this.cashTransferService.withdraw({
      ...createCashTransferDto,
    })
  }

  @Post('deposit')
  deposit(@Body() createCashTransferDto: CreateCashTransferDto) {
    return this.cashTransferService
      .deposit({
        ...createCashTransferDto,
      })
      .catch((err) => {
        throw new BadRequestException(err.message)
      })
  }

  @Post('loan')
  loan(@Body() CreateCashTransferDto: CreateCashTransferDto) {
    return this.cashTransferService.loan({
      ...CreateCashTransferDto,
    })
  }

  @Post('loan-payment')
  loanPayment(@Body() createLoanPayment: CreateLoanPaymentDto) {
    return this.cashTransferService.loanPayment(createLoanPayment)
  }

  @Get('loan-payments/:id')
  getLoanPayments(@Param('id') cashTransferId: string) {
    return this.cashTransferService.getLoanPayments(cashTransferId)
  }
}
