import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common'
import { CreateBankDto } from 'src/cash-transfer/dto/bank/create-bank.dto'
import { GetAllBankDto } from 'src/cash-transfer/dto/bank/get-all-bank.dto'
import { UpdateBankDto } from 'src/cash-transfer/dto/bank/update-bank.dto'
import { BankService } from 'src/cash-transfer/services/bank.service'

@Controller('cash-transfer/bank')
@UseInterceptors(ClassSerializerInterceptor)
export class BankController {
  constructor(private bankService: BankService) {}
  @Post()
  create(@Body() createBank: CreateBankDto) {
    return this.bankService.create(createBank)
  }

  @Get()
  findAll(@Query() getAllBankDto: GetAllBankDto) {
    return this.bankService.findAll(getAllBankDto)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bankService.findOne(id)
  }

  @Patch(':id')
  update(@Param('id') bankId: string, @Body() updateBank: UpdateBankDto) {
    return this.bankService.update({
      id: +bankId,
      ...updateBank,
    })
  }

  @Delete(':id')
  deleteOne(
    @Param('id') id: string,
    @Query('replacement_bank') replacement_bank: number,
  ) {
    return this.bankService.deleteOne(+id, replacement_bank)
  }

  @Delete()
  deleteAll() {
    return this.bankService.deleteAll()
  }

  /**
   * caesar_bank
   */

  @Post('init')
  init() {
    if (process.env.NODE_ENV === 'development') {
      return this.bankService.init()
    }

    throw new BadRequestException(`Illegal Operation`)
  }
}
