import { Test, TestingModule } from '@nestjs/testing';
import { LeaderboardController } from './leaderboard.controller';
import { LeaderboardService } from './leaderboard.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';

describe('LeaderboardController', () => {
  let controller: LeaderboardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeaderboardController],
      providers: [
        ConfigService,
        AuthService,
        UsersService,
        LeaderboardService,
        PrismaService,
      ],
    }).compile();

    controller = module.get<LeaderboardController>(LeaderboardController);
  });

  it('should return a list of users', () => {
    expect(controller.findAll()).toBeDefined();
  });
});
