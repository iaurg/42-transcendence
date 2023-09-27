import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';
import { JwtPayload } from '../dto/jwt.dto';
import { Request } from 'express';
import { User } from '@prisma/client';

@Injectable()
export class MultiFactorAuthStrategy extends PassportStrategy(Strategy, '2fa') {
  constructor(
    configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        MultiFactorAuthStrategy.extractAccessJwtFromCookie,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  private static extractAccessJwtFromCookie(req: Request): string | null {
    return req.cookies?.accessToken ?? null;
  }

  async validate(payload: JwtPayload): Promise<User> {
    const user = await this.usersService.findOne(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.mfaEnabled) {
      return user;
    }

    if (payload.mfaAuthenticated) {
      return user;
    }
  }
}
