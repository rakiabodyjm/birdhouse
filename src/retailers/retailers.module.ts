import { Module } from '@nestjs/common'
import { RetailersService } from './retailers.service'
import { RetailersController } from './retailers.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Retailer } from 'src/retailers/entities/retailer.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Retailer])],
  controllers: [RetailersController],
  providers: [RetailersService],
  exports: [RetailersService],
})
export class RetailersModule {}
