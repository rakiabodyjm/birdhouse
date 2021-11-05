import { Test, TestingModule } from '@nestjs/testing';
import { ExternalCeasarController } from './external-ceasar.controller';
import { ExternalCeasarService } from './external-ceasar.service';

describe('ExternalCeasarController', () => {
  let controller: ExternalCeasarController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExternalCeasarController],
      providers: [ExternalCeasarService],
    }).compile();

    controller = module.get<ExternalCeasarController>(ExternalCeasarController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
