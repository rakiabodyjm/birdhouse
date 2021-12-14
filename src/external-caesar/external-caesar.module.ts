import { Module } from '@nestjs/common'
import { ExternalCaesarService } from './external-caesar.service'
import { ExternalCaesarController } from './external-caesar.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ExternalCaesar } from 'src/external-caesar/entities/external-caesar.entity'

@Module({
  imports: [TypeOrmModule.forFeature([ExternalCaesar])],
  controllers: [ExternalCaesarController],
  providers: [ExternalCaesarService],
})
export class ExternalCaesarModule {}
