import { Test, TestingModule } from '@nestjs/testing';
import { ActualCaesarService } from './actual-caesar.service';

describe('ActualCaesarService', () => {
  let service: ActualCaesarService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ActualCaesarService],
    }).compile();

    service = module.get<ActualCaesarService>(ActualCaesarService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
