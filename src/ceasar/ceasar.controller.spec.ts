import { Test, TestingModule } from '@nestjs/testing';
import { CeasarController } from './ceasar.controller';
import { CeasarService } from './ceasar.service';

describe('CeasarController', () => {
  let controller: CeasarController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CeasarController],
      providers: [CeasarService],
    }).compile();

    controller = module.get<CeasarController>(CeasarController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
