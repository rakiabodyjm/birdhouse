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
import { ExternalCaesarService } from './external-caesar.service'
import { CreateExternalCaesarDto } from './dto/create-external-caesar.dto'
import { ExternalCaesar } from 'src/external-caesar/entities/external-caesar.entity'
import { ApiTags } from '@nestjs/swagger'

@UseInterceptors(ClassSerializerInterceptor)
@Controller('external-caesar')
@ApiTags('External Caesar')
export class ExternalCaesarController {
  constructor(private readonly externalCaesarService: ExternalCaesarService) {}

  @Post()
  create(@Body() createExternalCaesarDto: CreateExternalCaesarDto) {
    const newExternalCaesar: Omit<ExternalCaesar, 'wallet_id'> = {
      ...createExternalCaesarDto,
      caesar_coin: 0,
      peso: 0,
      dollar: 0,
    }

    return this.externalCaesarService.create(newExternalCaesar)
  }

  @Get()
  findAll() {
    return this.externalCaesarService.findAll()
  }

  @Delete()
  deleteAll() {
    return this.externalCaesarService.clear()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.externalCaesarService.findOne(id).catch((err) => {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST)
    })
  }
}
