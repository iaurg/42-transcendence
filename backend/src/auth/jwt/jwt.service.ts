import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CookieOptions, Response } from 'express';
import { UsersService } from 'src/users/users.service';
import { User } from '@prisma/client';
import { AuthTokens, JwtPayload } from '../dto/jwt.dto';
import ms from 'ms';
import * as argon2 from 'argon2';

@Injectable()
export class JwtAuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}

  private accessTokenExpiration: string = this.configService.get(
    'ACCESS_TOKEN_EXPIRATION',
    '1h',
  );

  private refreshTokenExpiration: string = this.configService.get(
    'REFRESH_TOKEN_EXPIRATION',
    '1d',
  );

  private generatePayload(user: User) {
    return {
      sub: user.login,
      email: user.email,
    } as JwtPayload;
  }

  private async updateRefreshToken(user: User, refreshToken: string) {
    const hash = await argon2.hash(refreshToken, {
      secret: Buffer.from(this.configService.get('HASH_PEPPER')),
    });

    await this.usersService.update(user.login, {
      refreshToken: hash,
    });
  }

  async generateJwt(user: User) {
    const payload = this.generatePayload(user);
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.accessTokenExpiration,
      secret: this.configService.get('JWT_SECRET'),
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.refreshTokenExpiration,
      secret: this.configService.get('JWT_SECRET'),
    });

    await this.updateRefreshToken(user, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  private generateCookieOptions(): CookieOptions {
    // TODO retrieve domain from config later on
    const domain =
      this.configService.get('NODE_ENV') !== 'production' ? 'localhost' : '';
    const cookieOptions = {
      domain: domain,
      httpOnly: true,
      sameSite: 'lax',
      secure: domain !== 'localhost',
    } as CookieOptions;
    return cookieOptions;
  }

  async removeTokensFromCookie(res: Response) {
    const cookieOptions = this.generateCookieOptions();
    res.clearCookie('accessToken', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);
  }

  async storeTokensInCookie(res: Response, authToken: AuthTokens) {
    const cookieOptions = this.generateCookieOptions();
    res.cookie('accessToken', authToken.accessToken, {
      ...cookieOptions,
      maxAge: ms(this.accessTokenExpiration),
    });
    res.cookie('refreshToken', authToken.refreshToken, {
      ...cookieOptions,
      maxAge: ms(this.refreshTokenExpiration),
    });
  }

  async refreshJwt(login: string) {
    const user = await this.usersService.findOne(login);
    if (!user) {
      throw new ForbiddenException('User not found');
    }
    if (!user.refreshToken) {
      throw new ForbiddenException('Session expired, please log in again.');
    }
    return await this.generateJwt(user);
  }
}
