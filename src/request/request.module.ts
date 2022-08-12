import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
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
