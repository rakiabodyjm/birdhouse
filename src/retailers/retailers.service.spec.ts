import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { CreateRetailerDto } from 'src/retailers/dto/create-retailer.dto'
import { Retailer } from 'src/retailers/entities/retailer.entity'
import { Repository } from 'typeorm'
import { RetailersService } from './retailers.service'

describe('RetailersService', () => {
  let service: RetailersService

  const mockRetailerRepository: Partial<Repository<Retailer>> = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest
      .fn()
      .mockImplementation((newUser) =>
        Promise.resolve({ id: Date.now(), ...newUser }),
      ),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RetailersService,
        {
          provide: getRepositoryToken(Retailer),
          useValue: mockRetailerRepository,
        },
      ],
    }).compile()

    service = module.get<RetailersService>(RetailersService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('Should Create a new retailer', async () => {
    const retailer: Partial<CreateRetailerDto> = {
      e_bind_number: '09493031',
      store_name: 'hello worler',
    }
    expect(
      await service.create({
        ...retailer,
      }),
    ).toEqual({
      id: expect.any(Number),
      e_bind_number: '09493031',
      store_name: 'hello worler',
    })

    expect(mockRetailerRepository.create).toHaveBeenCalledWith({
      e_bind_number: '09493031',
      store_name: 'hello worler',
    })

    expect(mockRetailerRepository.save).toHaveBeenCalled()
  })
})
