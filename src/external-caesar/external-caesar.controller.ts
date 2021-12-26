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

@UseInterceptors(ClassSerializerInterceptor)
@Controller('external-caesar')
@ApiTags('External Caesar')
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

  @UseGuards(PayCaesarSecretGuard)
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
