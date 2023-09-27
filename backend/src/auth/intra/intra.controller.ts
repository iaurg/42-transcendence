import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { IntraService } from './intra.service';
import { IntraOAuthGuard } from './intra.guard';
import { Request, Response } from 'express';
import { IntraUserProfile } from '../dto';
import { JwtAuthService } from '../jwt/jwt.service';
import { ConfigService } from '@nestjs/config';

@Controller('auth/intra')
export class IntraController {
  constructor(
    private intraService: IntraService,
    private jwtAuthService: JwtAuthService,
    private configService: ConfigService,
  ) {}

  @UseGuards(IntraOAuthGuard)
  @Get()
  async intraOAuth() {
    // this route is just for redirecting to intra oauth
  }

  @UseGuards(IntraOAuthGuard)
  @Get('callback')
  async intraOAuthCallback(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const user = req.user as IntraUserProfile;
      const tokens = await this.intraService.login(user);

      await this.jwtAuthService.storeTokensInCookie(res, tokens);

      res.redirect(`${this.configService.get('FRONTEND_URL')}/auth/redirect`);
    } catch (error) {
      return error;
    }
  }
}
