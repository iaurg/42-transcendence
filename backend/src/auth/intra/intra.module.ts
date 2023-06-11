import { Module } from '@nestjs/common';
import { IntraService } from './intra.service';
import { IntraController } from './intra.controller';
import { UsersModule } from 'src/users/users.module';
import { IntraStrategy } from './intra.strategy';
import { HttpModule } from '@nestjs/axios';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthModule } from '../jwt/jwt.module';

@Module({
  imports: [UsersModule, HttpModule, PassportModule, JwtAuthModule],
  providers: [IntraService, IntraStrategy],
  controllers: [IntraController],
  exports: [],
})
export class IntraModule {}
