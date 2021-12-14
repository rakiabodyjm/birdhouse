import { Module } from '@nestjs/common'
import { SubdistributorService } from './subdistributor.service'
import { SubdistributorController } from './subdistributor.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Subdistributor } from 'src/subdistributor/entities/subdistributor.entity'
import { CaesarModule } from 'src/caesar/caesar.module'
import { MapIdsModule } from 'src/map-ids/map-ids.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Subdistributor]),
    CaesarModule,
    MapIdsModule,
  ],
  controllers: [SubdistributorController],
  providers: [SubdistributorService],
  exports: [SubdistributorService],
})
export class SubdistributorModule {}
