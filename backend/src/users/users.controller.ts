import { Controller, Get, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private service: UsersService) {}

  @Get('me')
  findMe(@Body() dto: any) {
    return this.service.findMe(dto);
  }
}
