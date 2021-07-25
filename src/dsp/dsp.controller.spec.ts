import { Test, TestingModule } from '@nestjs/testing'
import { DspController } from './dsp.controller'
import { DspService } from './dsp.service'

describe('DspController', () => {
  let controller: DspController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DspController],
      providers: [DspService],
    }).compile()

    controller = module.get<DspController>(DspController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
