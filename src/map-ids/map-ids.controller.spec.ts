import { Test, TestingModule } from '@nestjs/testing'
import { MapIdsController } from './map-ids.controller'
import { MapIdsService } from './map-ids.service'

describe('MapIdsController', () => {
  let controller: MapIdsController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MapIdsController],
      providers: [MapIdsService],
    }).compile()

    controller = module.get<MapIdsController>(MapIdsController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
