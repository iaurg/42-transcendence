import { Test, TestingModule } from '@nestjs/testing';
import { MatchHistoryService } from './match-history.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { AuthService } from 'src/auth/auth.service';
import { ConfigService } from '@nestjs/config';

describe('MatchHistoryService', () => {
  let service: MatchHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        AuthService,
        UsersService,
        MatchHistoryService,
        PrismaService,
      ],
    }).compile();

    service = module.get<MatchHistoryService>(MatchHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
