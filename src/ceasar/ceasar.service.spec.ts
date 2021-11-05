import { Test, TestingModule } from '@nestjs/testing';
import { CeasarService } from './ceasar.service';

describe('CeasarService', () => {
  let service: CeasarService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CeasarService],
    }).compile();

    service = module.get<CeasarService>(CeasarService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
