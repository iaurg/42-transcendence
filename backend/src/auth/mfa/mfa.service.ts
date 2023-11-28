import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { Response } from 'express';
import { UsersService } from 'src/users/users.service';
import { toFileStream } from 'qrcode';
import { authenticator } from 'otplib';
import { ConfigService } from '@nestjs/config';
import { JwtAuthService } from '../jwt/jwt.service';

@Injectable()
export class MultiFactorAuthService {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
    private jwtAuthService: JwtAuthService,
  ) {}

  async generateQRCode(user: User) {
    const login = user.login;
    const secret = authenticator.generateSecret();
    const appName = this.configService.get('APP_NAME');
    const otpauthUrl = authenticator.keyuri(login, appName, secret);
    await this.usersService.updateAuth(login, {
      mfaSecret: secret,
    });
    return otpauthUrl;
  }

  async streamQRCode(res: Response, otpauthUrl: string) {
    return toFileStream(res, otpauthUrl);
  }

  async isCodeValid(user: User, code: string): Promise<boolean> {
    return authenticator.verify({
      token: code,
      secret: user.mfaSecret,
    });
  }

  async disableMfa(user: User, res: Response) {
    const updated_user = await this.usersService.updateAuth(user.login, {
      mfaEnabled: false,
      mfaSecret: null,
    });
    const tokens = await this.jwtAuthService.generateJwt(updated_user, false);
    await this.jwtAuthService.storeTokensInCookie(res, tokens);
    return { msg: '2FA disabled' };
  }

  async enableMfa(user: User, res: Response) {
    const updated_user = await this.usersService.updateAuth(user.login, {
      mfaEnabled: true,
    });
    const tokens = await this.jwtAuthService.generateJwt(updated_user, true);
    await this.jwtAuthService.storeTokensInCookie(res, tokens);
    return tokens;
  }

  async authenticate(user: User, res: Response) {
    const tokens = await this.jwtAuthService.generateJwt(user, true);
    await this.jwtAuthService.storeTokensInCookie(res, tokens);
    return tokens;
  }
}
