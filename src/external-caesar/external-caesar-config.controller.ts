import {
  UseInterceptors,
  ClassSerializerInterceptor,
  Controller,
  Patch,
  Body,
  Param,
  Get,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { UpdateExternalCaesarConfigDto } from './dto/update-external-caesar-config,dto'
import { ExternalCaesarConfig } from './entities/external-caesar-config.entity'
import { ExternalCaesarConfigService } from './external-caesar-config.service'

@UseInterceptors(ClassSerializerInterceptor)
@Controller('external-caesar-config')
@ApiTags('External Caesar')
export class ExternalCaesarConfigController {
  constructor(
    private readonly externalCaesarConfigService: ExternalCaesarConfigService,
  ) {}

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateExternalCaesarConfigDto: UpdateExternalCaesarConfigDto,
  ): Promise<ExternalCaesarConfig> {
    return this.externalCaesarConfigService.update(
      id,
      updateExternalCaesarConfigDto,
    )
  }

  @Get('/')
  findOne() {
    return this.externalCaesarConfigService
      .findOne()
      .then((res) => {
        return res
      })
      .catch((err) => {
        throw new HttpException(err.message, HttpStatus.BAD_REQUEST)
      })
  }

  async dollarCreate(): Promise<ExternalCaesarConfig> {
    return this.externalCaesarConfigService.create('1', '55')
  }
}
