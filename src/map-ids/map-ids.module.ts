import { Module } from '@nestjs/common'
import { MapIdsService } from './map-ids.service'
import { MapIdsController } from './map-ids.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MapId } from 'src/map-ids/entities/map-id.entity'

@Module({
  imports: [TypeOrmModule.forFeature([MapId])],
  controllers: [MapIdsController],
  providers: [MapIdsService],
  exports: [MapIdsService],
})
export class MapIdsModule {}
