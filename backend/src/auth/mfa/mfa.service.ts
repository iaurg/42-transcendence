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
    console.log('generateQRCode'); // NOTE remove
    console.log(user);
    const login = user.login;
    const secret = authenticator.generateSecret();
    console.log('secret', secret);
    const appName = this.configService.get('APP_NAME');
    console.log('appName', appName);
    const otpauthUrl = authenticator.keyuri(login, appName, secret);
    console.log('otpauthUrl', otpauthUrl);
    const updated_user = await this.usersService.update(login, {
      mfaSecret: secret,
    });
    console.log(updated_user);
    return otpauthUrl;
  }

  async streamQRCode(res: Response, otpauthUrl: string) {
    console.log('streamQRCode'); // NOTE remove
    return toFileStream(res, otpauthUrl);
  }

  async isCodeValid(user: User, code: string): Promise<boolean> {
    console.log('isCodeValid'); // NOTE remove
    return authenticator.verify({
      token: code,
      secret: user.mfaSecret,
    });
  }

  async disableMfa(user: User, res: Response) {
    console.log('disableMfa'); // NOTE remove
    const updated_user = await this.usersService.update(user.login, {
      mfaEnabled: false,
      mfaSecret: null,
    });
    const tokens = await this.jwtAuthService.generateJwt(updated_user, false);
    await this.jwtAuthService.storeTokensInCookie(res, tokens);
    console.log('post-disable tokens', tokens);
    return tokens;
  }

  async enableMfa(user: User, res: Response) {
    console.log('enableMfa'); // NOTE remove
    const updated_user = await this.usersService.update(user.login, { mfaEnabled: true });
    const tokens = await this.jwtAuthService.generateJwt(updated_user, true);
    await this.jwtAuthService.storeTokensInCookie(res, tokens);
    console.log('post-enable tokens', tokens);
    return tokens;
  }

  async authenticate(user: User, res: Response) {
    console.log('authenticate'); // NOTE remove
    const tokens = await this.jwtAuthService.generateJwt(user, true);
    await this.jwtAuthService.storeTokensInCookie(res, tokens);
    console.log('post-authenticate tokens', tokens);
    return tokens;
  }
}
