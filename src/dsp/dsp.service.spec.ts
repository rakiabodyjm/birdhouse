import { Test, TestingModule } from '@nestjs/testing'
import { DspService } from './dsp.service'

describe('DspService', () => {
  let service: DspService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DspService],
    }).compile()

    service = module.get<DspService>(DspService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
