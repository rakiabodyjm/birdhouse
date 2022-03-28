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
} from '@nestjs/common'
import { CashTransferService } from 'src/cash-transfer/services/cash-transfer.service'
import { CreateCashTransferDto } from 'src/cash-transfer/dto/cash-transfer/create-cash-transfer.dto'
import { UpdateCashTransferDto } from 'src/cash-transfer/dto/cash-transfer/update-cash-transfer.dto'
import { GetAllCashTransferDto } from 'src/cash-transfer/dto/cash-transfer/get-all-cash-transfer.dto'

@Controller('cash-transfer')
@UseInterceptors(ClassSerializerInterceptor)
export class CashTransferController {
  constructor(private readonly cashTransferService: CashTransferService) {}

  @Post()
  create(@Body() createCashTransferDto: CreateCashTransferDto) {
    return this.cashTransferService.create(createCashTransferDto)
  }

  @Get()
  findAll(@Query() getAllCashTransfer: GetAllCashTransferDto) {
    return this.cashTransferService.findAll(getAllCashTransfer)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cashTransferService.findOne(+id)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCashTransferDto: UpdateCashTransferDto,
  ) {
    return this.cashTransferService.update(+id, updateCashTransferDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cashTransferService.delete(+id)
  }
}
