import { Test, TestingModule } from '@nestjs/testing'
import { InventoryLogService } from './inventorylog.service'

describe('InventoryLogService', () => {
  let service: InventoryLogService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InventoryLogService],
    }).compile()

    service = module.get<InventoryLogService>(InventoryLogService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
