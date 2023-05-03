import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';

// The local strategy will be used to validate a user's email and password.
// The validate() method will be called by the Passport module.

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(email: string, password: string): Promise<any> {
    // The validate() method will be called by the Passport module.
    // The validate() method will call the AuthService's validateUser() method.
    // The validateUser() method will return a user object if the email and password are valid.
    // The user object will be attached to the Request object after the validate() method returns.
    const user = await this.authService.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
