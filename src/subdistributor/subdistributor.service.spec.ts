import { Test, TestingModule } from '@nestjs/testing'
import { SubdistributorService } from './subdistributor.service'

describe('SubdistributorService', () => {
  let service: SubdistributorService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubdistributorService],
    }).compile()

    service = module.get<SubdistributorService>(SubdistributorService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
