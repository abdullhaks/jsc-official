import { Test, TestingModule } from '@nestjs/testing';
import { LatestContentController } from './latest-content.controller';

describe('LatestContentController', () => {
  let controller: LatestContentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LatestContentController],
    }).compile();

    controller = module.get<LatestContentController>(LatestContentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
