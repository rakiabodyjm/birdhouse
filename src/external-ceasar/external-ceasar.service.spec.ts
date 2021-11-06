import { Test, TestingModule } from '@nestjs/testing';
import { ExternalCeasarService } from './external-ceasar.service';

describe('ExternalCeasarService', () => {
  let service: ExternalCeasarService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExternalCeasarService],
    }).compile();

    service = module.get<ExternalCeasarService>(ExternalCeasarService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
