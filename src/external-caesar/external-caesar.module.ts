import { Module } from '@nestjs/common'
import { ExternalCaesarService } from './external-caesar.service'
import { ExternalCaesarController } from './external-caesar.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ExternalCaesar } from 'src/external-caesar/entities/external-caesar.entity'
import { ConfigModule } from '@nestjs/config'
import { ExternalCaesarConfigService } from './external-caesar-config.service'
import { ExternalCaesarConfigController } from './external-caesar-config.controller'
import { ExternalCaesarConfig } from './entities/external-caesar-config.entity'

@Module({
  imports: [TypeOrmModule.forFeature([ExternalCaesar, ExternalCaesarConfig])],
  controllers: [ExternalCaesarController, ExternalCaesarConfigController],
  providers: [ExternalCaesarService, ConfigModule, ExternalCaesarConfigService],
})
export class ExternalCaesarModule {}
