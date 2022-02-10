import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UpdateExternalCaesarConfigDto } from './dto/update-external-caesar-config,dto'
import { ExternalCaesarConfig } from './entities/external-caesar-config.entity'

@Injectable()
export class ExternalCaesarConfigService {
  constructor(
    @InjectRepository(ExternalCaesarConfig)
    private externalCaesarConfigRepo: Repository<ExternalCaesarConfig>,
  ) {}

  async update(
    id: string,
    updateExternalCaesarConfig: UpdateExternalCaesarConfigDto,
  ) {
    const ExternalCaesarConfig = await this.externalCaesarConfigRepo.findOne(id)
    await this.externalCaesarConfigRepo.update(id, {
      ...updateExternalCaesarConfig,
    })

    return {
      ...ExternalCaesarConfig,
      ...updateExternalCaesarConfig,
    } as ExternalCaesarConfig
  }

  findOne(): Promise<ExternalCaesarConfig> {
    return this.externalCaesarConfigRepo.findOneOrFail().catch(() => {
      return this.create('1', '50.50')
    })
  }

  create(
    peso_rate: string,
    dollar_rate: string,
  ): Promise<ExternalCaesarConfig> {
    const dollarData = this.externalCaesarConfigRepo.create({
      peso_rate,
      dollar_rate,
    })
    return this.externalCaesarConfigRepo.save(dollarData)
  }
  dollarCreate(): string {
    return '54'
  }
}
