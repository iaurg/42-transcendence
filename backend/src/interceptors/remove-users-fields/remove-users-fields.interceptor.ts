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
    return next.handle().pipe(
      map((user) => {
        if (!user) {
          return user;
        }
        delete user.refreshToken;
        delete user.mfaSecret;
        // NOTE Is it necessary to remove mfaEnabled?
        // delete user.mfaEnabled;
        return user;
      }),
    );
  }
}
