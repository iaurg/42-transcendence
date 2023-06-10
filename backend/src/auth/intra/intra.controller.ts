import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { IntraService } from './intra.service';
import { IntraOAuthGuard } from './intra.guard';
import { Request, Response } from 'express';
import { IntraUserProfile } from './dto';

@Controller('auth/intra')
export class IntraController {
  constructor(private intraService: IntraService) {}

  @UseGuards(IntraOAuthGuard)
  @Get()
  async intraOAuth() {
    // NOTE this route is just for redirecting to intra oauth
  }

  @UseGuards(IntraOAuthGuard)
  @Get('callback')
  async intraOAuthCallback(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = req.user as IntraUserProfile;
    const jwt: string = await this.intraService.login(user);

    // TODO redirect to frontend with jwt in cookie

    // NOTE for now redirecting to show user data
    return user;
  }
}
