import { Test, TestingModule } from '@nestjs/testing'
import { CaesarController } from './caesar.controller'
import { CaesarService } from './caesar.service'

describe('CaesarController', () => {
  let controller: CaesarController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CaesarController],
      providers: [CaesarService],
    }).compile()

    controller = module.get<CaesarController>(CaesarController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
