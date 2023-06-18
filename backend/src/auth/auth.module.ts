import { Module } from '@nestjs/common';
import { IntraModule } from './intra/intra.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from 'src/users/users.service';
import { JwtAuthModule } from './jwt/jwt.module';
import { MultiFactorAuthModule } from './mfa/mfa.module';

@Module({
  imports: [IntraModule, JwtAuthModule, MultiFactorAuthModule],
  providers: [AuthService, UsersService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
