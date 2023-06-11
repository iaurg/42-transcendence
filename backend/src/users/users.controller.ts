import { Controller, Get, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AccessTokenGuard } from 'src/auth/jwt/jwt.guard';

@Controller('users')
export class UsersController {
  constructor(private service: UsersService) {}

  @UseGuards(AccessTokenGuard)
  @Get('me')
  findMe(@Body() dto: any) {
    return this.service.findMe(dto);
  }
}
