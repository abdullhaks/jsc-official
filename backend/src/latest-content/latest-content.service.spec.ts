import { Test, TestingModule } from '@nestjs/testing';
import { LatestContentService } from './latest-content.service';

describe('LatestContentService', () => {
  let service: LatestContentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LatestContentService],
    }).compile();

    service = module.get<LatestContentService>(LatestContentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
