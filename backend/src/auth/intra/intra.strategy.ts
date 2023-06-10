import { Strategy, VerifyCallback } from 'passport-oauth2';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { IntraUserProfile } from './dto';

@Injectable()
export class IntraStrategy extends PassportStrategy(Strategy, 'intra') {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    super({
      authorizationURL: 'https://api.intra.42.fr/oauth/authorize',
      tokenURL: 'https://api.intra.42.fr/oauth/token',
      clientID: configService.get<string>('INTRA_CLIENT_ID'),
      clientSecret: configService.get<string>('INTRA_CLIENT_SECRET'),
      callbackURL: configService.get<string>('INTRA_CALLBACK_URL'),
      proxy: true,
    });
  }

  async validate(
    accessToken: string,
    _refreshToken: string,
    _profile: any,
    callback: VerifyCallback,
  ) {
    const user = await this.httpService.axiosRef.get(
      'https://api.intra.42.fr/v2/me',
      {
        params: {
          access_token: accessToken,
        },
      },
    );
    const profile: IntraUserProfile = {
      login: user.data.login,
      avatar: user.data.image.link,
      email: user.data.email,
      firstName: user.data.first_name,
      lastName: user.data.last_name,
      accessToken: accessToken,
      refreshToken: _refreshToken,
    };
    callback(null, profile);
  }
}
