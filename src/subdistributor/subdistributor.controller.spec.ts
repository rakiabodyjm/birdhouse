import { Test, TestingModule } from '@nestjs/testing'
import { SubdistributorController } from './subdistributor.controller'
import { SubdistributorService } from './subdistributor.service'

describe('SubdistributorController', () => {
  let controller: SubdistributorController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubdistributorController],
      providers: [SubdistributorService],
    }).compile()

    controller = module.get<SubdistributorController>(SubdistributorController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
