import { Test, TestingModule } from '@nestjs/testing'
import { GetAllRetailerDto } from 'src/retailers/dto/get-all-retailer.dto'
import { RetailersController } from 'src/retailers/retailers.controller'
import { RetailersService } from 'src/retailers/retailers.service'

describe('RetailersController', () => {
  let retailerController: RetailersController

  const mockRetailerService = {
    findAll: jest.fn((arg: GetAllRetailerDto) => {
      const dspRetailes = Array(5).map((ea, index) => ({
        id: index,
        dsp: '1',
        subdistributor: '1',
      }))

      if (arg.countOnly) {
        return dspRetailes.length
      }
    }),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RetailersController],
      providers: [RetailersService],
    })
      .overrideProvider(RetailersService)
      .useValue(mockRetailerService)
      .compile()
    retailerController = module.get<RetailersController>(RetailersController)
  })

  it('Should be defined', () => {
    expect(retailerController).toBeDefined()
  })

  it('Should return number of Retailers', async () => {
    const count = await retailerController.findAll({
      countOnly: true,
    })

    expect(count).toBe(5)

    expect(mockRetailerService.findAll).toHaveBeenCalledWith({
      countOnly: true,
    })
  })
})
