import { Module } from '@nestjs/common';
import { LobbyService } from './lobby.service';
import { LobbyController } from './lobby.controller';

@Module({
  providers: [LobbyService],
  controllers: [LobbyController],
})
export class LobbyModule {}
