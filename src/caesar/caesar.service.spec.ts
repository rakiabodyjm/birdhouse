import { Test, TestingModule } from '@nestjs/testing'
import { CaesarService } from './caesar.service'

describe('CaesarService', () => {
  let service: CaesarService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CaesarService],
    }).compile()

    service = module.get<CaesarService>(CaesarService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
