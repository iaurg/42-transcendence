import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class IntraOAuthGuard extends AuthGuard('intra') {}
// NOTE this class is just an alias for AuthGuard('intra')
