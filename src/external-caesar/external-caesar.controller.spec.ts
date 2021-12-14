import { Test, TestingModule } from '@nestjs/testing'
import { ExternalCaesarController } from './external-caesar.controller'
import { ExternalCaesarService } from './external-caesar.service'

describe('ExternalCaesarController', () => {
  let controller: ExternalCaesarController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExternalCaesarController],
      providers: [ExternalCaesarService],
    }).compile()

    controller = module.get<ExternalCaesarController>(ExternalCaesarController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
