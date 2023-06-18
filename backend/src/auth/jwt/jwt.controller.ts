import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { JwtAuthService } from './jwt.service';
import { Request, Response } from 'express';
import { RefreshTokenGuard } from './jwt.guard';
import { User } from '@prisma/client';

@Controller('auth/jwt')
export class JwtAuthController {
  constructor(private jwtAuthService: JwtAuthService) {}

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const user = req.user as User;
      // NOTE this refreshes the refresh token as well. So the user can stay logged in forever.
      const tokens = await this.jwtAuthService.refreshJwt(user.login);
      await this.jwtAuthService.storeTokensInCookie(res, tokens);
      return tokens;
    } catch (error) {
      return error;
    }
  }
}
