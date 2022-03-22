import { Test, TestingModule } from '@nestjs/testing';
import { ActualCaesarController } from './actual-caesar.controller';
import { ActualCaesarService } from './actual-caesar.service';

describe('ActualCaesarController', () => {
  let controller: ActualCaesarController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActualCaesarController],
      providers: [ActualCaesarService],
    }).compile();

    controller = module.get<ActualCaesarController>(ActualCaesarController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
