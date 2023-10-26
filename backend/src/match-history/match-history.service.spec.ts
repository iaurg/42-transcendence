import { Test, TestingModule } from '@nestjs/testing';
import { MatchHistoryService } from './match-history.service';

describe('MatchHistoryService', () => {
  let service: MatchHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MatchHistoryService],
    }).compile();

    service = module.get<MatchHistoryService>(MatchHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
