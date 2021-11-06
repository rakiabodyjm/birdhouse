import { Module } from '@nestjs/common'
import { ExternalCeasarService } from './external-ceasar.service'
import { ExternalCeasarController } from './external-ceasar.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ExternalCeasar } from 'src/external-ceasar/entities/external-ceasar.entity'

@Module({
  imports: [TypeOrmModule.forFeature([ExternalCeasar])],
  controllers: [ExternalCeasarController],
  providers: [ExternalCeasarService],
})
export class ExternalCeasarModule {}
