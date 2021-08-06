import { Module } from '@nestjs/common'
import { MapIdsService } from './map-ids.service'
import { MapIdsController } from './map-ids.controller'

@Module({
  controllers: [MapIdsController],
  providers: [MapIdsService],
})
export class MapIdsModule {}
