import { Module } from '@nestjs/common'
import { SubdistributorService } from './subdistributor.service'
import { SubdistributorController } from './subdistributor.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Subdistributor } from 'src/subdistributor/entities/subdistributor.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Subdistributor])],
  controllers: [SubdistributorController],
  providers: [SubdistributorService],
  exports: [SubdistributorService],
})
export class SubdistributorModule {}
