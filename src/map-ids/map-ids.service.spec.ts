import { Test, TestingModule } from '@nestjs/testing'
import { MapIdsService } from './map-ids.service'

describe('MapIdsService', () => {
  let service: MapIdsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MapIdsService],
    }).compile()

    service = module.get<MapIdsService>(MapIdsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
