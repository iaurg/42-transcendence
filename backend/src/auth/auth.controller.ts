import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { AccessTokenGuard } from './jwt/jwt.guard';
import { JwtAuthService } from './jwt/jwt.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtAuthService: JwtAuthService,
  ) {}

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    await this.jwtAuthService.removeTokensFromCookie(res);
    return await this.authService.logout(req.user['login']);
  }
}
