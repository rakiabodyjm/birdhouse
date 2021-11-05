import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
  Get,
  Delete,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { ExternalCeasarService } from './external-ceasar.service'
import { CreateExternalCeasarDto } from './dto/create-external-ceasar.dto'
import { ExternalCeasar } from 'src/external-ceasar/entities/external-ceasar.entity'

@UseInterceptors(ClassSerializerInterceptor)
@Controller('external-ceasar')
export class ExternalCeasarController {
  constructor(private readonly externalCeasarService: ExternalCeasarService) {}

  @Post()
  create(@Body() createExternalCeasarDto: CreateExternalCeasarDto) {
    const newExternalCeasar: Omit<ExternalCeasar, 'wallet_id'> = {
      ...createExternalCeasarDto,
      ceasar_coin: 0,
      peso: 0,
      dollar: 0,
    }

    return this.externalCeasarService.create(newExternalCeasar)
  }

  @Get()
  findAll() {
    return this.externalCeasarService.findAll()
  }

  @Delete()
  deleteAll() {
    return this.externalCeasarService.clear()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.externalCeasarService.findOne(id).catch((err) => {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST)
    })
  }
}
