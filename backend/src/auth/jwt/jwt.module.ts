import { Module } from '@nestjs/common';
import { JwtAuthService } from './jwt.service';
import { JwtAuthController } from './jwt.controller';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthStrategy, RefreshJwtStrategy } from './jwt.strategy';

@Module({
  // TODO add jwt module register options
  imports: [UsersModule, PassportModule, JwtModule.register({})],
  providers: [JwtAuthService, JwtAuthStrategy, RefreshJwtStrategy],
  controllers: [JwtAuthController],
  exports: [JwtAuthService],
})
export class JwtAuthModule {}
