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
import { CreateTransferTypeDto } from 'src/cash-transfer/dto/transfer-type/create-transfer-type.dto'
import { GetAllTransferTypeDto } from 'src/cash-transfer/dto/transfer-type/get-all-transfer-type.dto'
import { UpdateTransferTypeDto } from 'src/cash-transfer/dto/transfer-type/update-transfer-type.dto'
import { TransferTypeService } from 'src/cash-transfer/services/transfer-type.service'

@Controller('cash-transfer/transfer-type')
@UseInterceptors(ClassSerializerInterceptor)
export class TransferTypeController {
  constructor(private transferTypeService: TransferTypeService) {}
  @Get()
  findAll(@Query() getAllTransferType: GetAllTransferTypeDto) {
    return this.transferTypeService.findAll(getAllTransferType)
  }

  @Post()
  create(@Body() createTransferType: CreateTransferTypeDto) {
    return this.transferTypeService.create(createTransferType)
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateTransferTypeDto: UpdateTransferTypeDto,
  ) {
    return this.transferTypeService.update(id, updateTransferTypeDto)
  }

  @Delete(':id')
  deleteOne(@Param('id') id: number) {
    return this.transferTypeService.deleteOne(+id)
  }

  @Delete()
  deleteAll() {
    return this.transferTypeService.deleteAll()
  }
}
