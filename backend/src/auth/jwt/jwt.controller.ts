import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { JwtAuthService } from './jwt.service';
import { Request, Response } from 'express';
import { IntraUserProfile } from '../dto';
import { RefreshTokenGuard } from './jwt.guard';

@Controller('auth/jwt')
export class JwtAuthController {
  constructor(private jwtAuthService: JwtAuthService) {}

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = req.user as IntraUserProfile;
    const tokens = await this.jwtAuthService.refreshJwt(user.login);
    await this.jwtAuthService.storeTokensInCookie(res, tokens);
    return 'tokens refreshed';
  }
}
