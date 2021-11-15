import { Module } from '@nestjs/common'
import { SubdistributorService } from './subdistributor.service'
import { SubdistributorController } from './subdistributor.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Subdistributor } from 'src/subdistributor/entities/subdistributor.entity'
import { CeasarModule } from 'src/ceasar/ceasar.module'

@Module({
  imports: [TypeOrmModule.forFeature([Subdistributor]), CeasarModule],
  controllers: [SubdistributorController],
  providers: [SubdistributorService],
  exports: [SubdistributorService],
})
export class SubdistributorModule {}
