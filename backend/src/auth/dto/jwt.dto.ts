export interface JwtPayload {
  sub: string; // login
  email: string; // email
  iat?: number; // issued at // NOTE is this needed?
  exp?: number; // expiration // NOTE is this needed?
  // TODO add multifactor authentication
}

export class AuthTokens {
  accessToken: string;
  refreshToken: string;
}
