import {
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
import { CreateCaesarBankDto } from 'src/cash-transfer/dto/caesar-bank/create-caesar-bank.dto'
import { GetAllCaesarBankDto } from 'src/cash-transfer/dto/caesar-bank/get-all-caesar-bank.dto'
import { UpdateCaesarBankDto } from 'src/cash-transfer/dto/caesar-bank/update-caesar-bank.dto'
import { CaesarBankService } from 'src/cash-transfer/services/caesar-bank.service'

@Controller('/cash-transfer/caesar-bank')
@UseInterceptors(ClassSerializerInterceptor)
export class CaesarBankController {
  constructor(private caesarBankService: CaesarBankService) {}
  @Get()
  findAll(@Query() getAll: GetAllCaesarBankDto) {
    return this.caesarBankService.findAll(getAll)
  }

  @Post()
  create(@Body() createCaesarBank: CreateCaesarBankDto) {
    return this.caesarBankService.create(createCaesarBank)
  }

  @Patch(':id')
  update(@Param('id') id: number, udpateCaesarBank: UpdateCaesarBankDto) {
    this.caesarBankService.update(id, udpateCaesarBank)
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.caesarBankService.findOne(id)
  }

  @Delete(':id')
  deleteOne(@Param('id') id: number) {
    return this.caesarBankService.deleteOne(id)
  }

  @Delete()
  deleteAll() {
    return this.caesarBankService.deleteAll()
  }
}
