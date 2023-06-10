import { Controller, Get, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // TODO add jwt guard
  @Get('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    // TODO remove jwt from cookie;
    return await this.authService.logout(req.user['login']);
  }
}
