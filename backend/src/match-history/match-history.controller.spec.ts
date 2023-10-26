import { Test, TestingModule } from '@nestjs/testing';
import { MatchHistoryController } from './match-history.controller';
import { MatchHistoryService } from './match-history.service';

describe('MatchHistoryController', () => {
  let controller: MatchHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchHistoryController],
      providers: [MatchHistoryService],
    }).compile();

    controller = module.get<MatchHistoryController>(MatchHistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
