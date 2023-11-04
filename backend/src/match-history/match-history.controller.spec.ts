import { Test, TestingModule } from '@nestjs/testing';
import { MatchHistoryController } from './match-history.controller';
import { MatchHistoryService } from './match-history.service';
import { ConfigService } from '@nestjs/config';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('MatchHistoryController', () => {
  let controller: MatchHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchHistoryController],
      providers: [
        ConfigService,
        AuthService,
        UsersService,
        MatchHistoryService,
        PrismaService,
      ],
    }).compile();

    controller = module.get<MatchHistoryController>(MatchHistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
