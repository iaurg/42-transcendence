import { AuthGuard } from '@nestjs/passport';

export class MultiFactorGuard extends AuthGuard('2fa') {}
