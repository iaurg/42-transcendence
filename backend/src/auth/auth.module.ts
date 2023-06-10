import { Module } from '@nestjs/common';
import { IntraModule } from './intra/intra.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [IntraModule],
  providers: [AuthService, UsersService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
