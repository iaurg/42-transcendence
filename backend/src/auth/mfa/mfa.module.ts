import { Module } from '@nestjs/common';
import { MultiFactorAuthController } from './mfa.controller';
import { MultiFactorAuthService } from './mfa.service';
import { JwtAuthModule } from '../jwt/jwt.module';
import { MultiFactorAuthStrategy } from './mfa.strategy';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [JwtAuthModule, UsersModule],
  controllers: [MultiFactorAuthController],
  providers: [MultiFactorAuthService, MultiFactorAuthStrategy],
})
export class MultiFactorAuthModule {}
