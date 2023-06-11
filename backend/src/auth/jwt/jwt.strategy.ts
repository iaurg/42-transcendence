import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt } from 'passport-jwt';
import { Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';
import { JwtPayload } from '../dto/jwt.dto';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private userService: UsersService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtAuthStrategy.getAccessTokenFromCookie,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  private static getAccessTokenFromCookie(req: Request): string | null {
    return req.cookies?.accessToken ?? null;
  }

  async validate(payload: JwtPayload) {
    // TODO retrieve user from database
    // const user = await this.userService.findOne(payload.sub);
    // if (!user) {throw new UnauthorizedException('Please log in to continue');}
    return true;
  }
}

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        RefreshJwtStrategy.getRefreshTokenFromCookie,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    const refreshToken =
      RefreshJwtStrategy.extractRefreshJwtFromBearer(req) ??
      RefreshJwtStrategy.getRefreshTokenFromCookie(req);

    if (!refreshToken) {
      throw new UnauthorizedException('JWT refresh token not found');
    }

    // TODO retrieve user from database
    // const user = await this.usersService.findOne(payload.sub);
    // if (!user) {throw new UnauthorizedException('Please log in to continue');}
    // return user;
    return true;
  }

  private static extractRefreshJwtFromBearer(req: Request): string | null {
    return req.get('Authorization')?.replace('Bearer', '').trim();
  }

  private static getRefreshTokenFromCookie(req: Request): string | null {
    return req.cookies?.refreshToken ?? null;
  }
}
