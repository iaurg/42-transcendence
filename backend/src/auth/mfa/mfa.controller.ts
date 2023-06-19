import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { MultiFactorAuthService } from './mfa.service';
import { Request, Response } from 'express';
import { AccessTokenGuard } from '../jwt/jwt.guard';
import { MfaPayload } from '../dto/mfa.dto';
import { User } from '@prisma/client';

@Controller('auth/2fa')
export class MultiFactorAuthController {
  constructor(
    private usersService: UsersService,
    private mfaService: MultiFactorAuthService,
  ) {}

  @UseGuards(AccessTokenGuard)
  @Get('generate')
  async generateQRCode(@Req() req: Request, @Res() res: Response) {
    const user = req.user as User;

    try {
      const otpauthUrl = await this.mfaService.generateQRCode(user);
      res.setHeader('content-type', 'image/png');
      return await this.mfaService.streamQRCode(res, otpauthUrl);
    } catch (error) {
      return error;
    }
  }

  @UseGuards(AccessTokenGuard)
  @Post('disable')
  async disableMfa(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = req.user as User;

    try {
      return await this.mfaService.disableMfa(user, res);
    } catch (error) {
      return error;
    }
  }

  @UseGuards(AccessTokenGuard)
  @Post('enable')
  async enableMfa(
    @Req() req: Request,
    @Body() mfaPayload: MfaPayload,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = req.user as User;

    const isCodeValid = await this.mfaService.isCodeValid(
      user,
      mfaPayload.code,
    );
    if (!isCodeValid) {
      throw new UnauthorizedException('Invalid 2FA code');
    }
    try {
      return await this.mfaService.enableMfa(user, res);
    } catch (error) {
      return error;
    }
  }

  @UseGuards(AccessTokenGuard)
  @Post('authenticate')
  async authenticate(
    @Req() req: Request,
    @Body() mfaPayload: MfaPayload,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = req.user as User;

    const isCodeValid = await this.mfaService.isCodeValid(
      user,
      mfaPayload.code,
    );
    if (!isCodeValid) {
      throw new UnauthorizedException('Invalid 2FA code');
    }
    return await this.mfaService.authenticate(user, res);
  }
}
