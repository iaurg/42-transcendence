import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class RemoveUsersFieldsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<User> {
    // filter sensitive fields from user
    return next.handle().pipe(
      map((user) => {
        delete user.refreshToken;
        delete user.mfaSecret;
        delete user.mfaEnabled;
        return user;
      }),
    );
  }
}
