import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CookieOptions, Response } from 'express';
import { UsersService } from 'src/users/users.service';
import { User } from '@prisma/client';
import { AuthTokens, JwtPayload } from '../dto/jwt.dto';
import ms from 'ms';

@Injectable()
export class JwtAuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}

  // TODO remove hardcoded expiration times and use config
  private accessTokenExpiration = '1h';
  private refreshTokenExpiration = '1d';

  private generatePayload(user: User) {
    return {
      sub: user.login,
      email: user.email,
    } as JwtPayload;
  }

  private async updateRefreshToken(user: User, refreshToken: string) {
    // TODO hash refresh token
    // TODO store refresh token in database with usersService
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
    // NOTE is there a better way to do this?
    const domain = process.env.NODE_ENV === 'production' ? '' : 'localhost';
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
    // TODO retrieve user from database
    // const user = await this.usersService.findOne(login);
    // TODO validate user and refresh token
    // if (!user || !user.refreshToken) {
    //   throw new ForbiddenException('User not found');
    // }

    // TODO generate new access token
    // return await this.generateJwt(user);
    // NOTE using a mock user for now
    return await this.generateJwt({
      id: '1',
      login: login,
      displayName: 'Test User',
      email: 'test@email.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as User);
  }
}
