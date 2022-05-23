import { Public } from './../auth/decorators/public.decorator'
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
  UseGuards,
  Patch,
} from '@nestjs/common'
import { ExternalCaesarService } from './external-caesar.service'
import { CreateExternalCaesarDto } from './dto/create-external-caesar.dto'
import { ExternalCaesar } from 'src/external-caesar/entities/external-caesar.entity'
import { ApiTags } from '@nestjs/swagger'
import {
  TopUpExternalCaesarBodyDto,
  TopUpExternalCaesarParamDto,
} from 'src/external-caesar/dto/topup-external-caesar.dto'
import { PayCaesarSecretGuard } from 'src/external-caesar/guards/pay-caesar-secret.guard'
import { ConfigService } from '@nestjs/config'
import { UpdateExternalCaesarDto } from './dto/update-external-caesar.dto'

@UseInterceptors(ClassSerializerInterceptor)
@Controller('external-caesar')
@ApiTags('External Caesar')
@Public()
@UseGuards(PayCaesarSecretGuard)
export class ExternalCaesarController {
  constructor(
    private readonly externalCaesarService: ExternalCaesarService,
    private configService: ConfigService,
  ) {}

  @Post()
  create(@Body() createExternalCaesarDto: CreateExternalCaesarDto) {
    const newExternalCaesar: Omit<
      ExternalCaesar,
      'wallet_id' | 'updated_at' | 'created_at' | 'peso' | 'dollar'
    > = {
      ...createExternalCaesarDto,
      caesar_coin: 0,
      // peso: 0,
      // dollar: 0,
    }

    return this.externalCaesarService.create(newExternalCaesar)
  }

  @Patch()
  update(@Body() updateExternalCaesarDto: UpdateExternalCaesarDto) {
    const editExternalCaesar: Partial<ExternalCaesar> = {
      ...updateExternalCaesarDto,
      caesar_coin: 0,
      // peso: 0,
      // dollar: 0,
    }

    return this.externalCaesarService.update(editExternalCaesar)
  }

  @Get()
  findAll() {
    return this.externalCaesarService.findAll()
  }

  @Delete(':id')
  deleteOne(@Param('id') id: string) {
    return this.externalCaesarService.deleteOne(id)
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

  @Post('topup/:id')
  topUp(
    @Param() { id }: TopUpExternalCaesarParamDto,
    @Body() { amount }: TopUpExternalCaesarBodyDto,
  ) {
    return this.externalCaesarService.topUp({
      id,
      amount,
    })
  }
}
