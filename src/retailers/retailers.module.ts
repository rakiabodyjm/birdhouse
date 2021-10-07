import { Module } from '@nestjs/common'
import { RetailersService } from './retailers.service'
import { RetailersController } from './retailers.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Retailer } from 'src/retailers/entities/retailer.entity'
import { DspModule } from 'src/dsp/dsp.module'
import { SubdistributorModule } from 'src/subdistributor/subdistributor.module'

@Module({
  imports: [TypeOrmModule.forFeature([Retailer])],
  controllers: [RetailersController],
  providers: [RetailersService],
})
export class RetailersModule {}
