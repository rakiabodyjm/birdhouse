import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CaesarBankController } from 'src/cash-transfer/controllers/caesar-bank.controller'
import { CaesarBank } from 'src/cash-transfer/entities/caesar-bank.entity'
import { CaesarBankService } from 'src/cash-transfer/services/caesar-bank.service'
import { Request } from './entities/request.entity'
import { RequestController } from './request.controller'
import { RequestService } from './request.service'

@Module({
  imports: [TypeOrmModule.forFeature([Request])],
  controllers: [RequestController],
  providers: [RequestService],
  exports: [RequestService],
})
export class RequestModule {}
