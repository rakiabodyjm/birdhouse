import { Test, TestingModule } from '@nestjs/testing'
import { ExternalCaesarService } from './external-caesar.service'

describe('ExternalCaesarService', () => {
  let service: ExternalCaesarService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExternalCaesarService],
    }).compile()

    service = module.get<ExternalCaesarService>(ExternalCaesarService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
