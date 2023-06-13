export interface JwtPayload {
  sub: string; // login
  email: string; // email
  iat?: number; // issued at
  exp?: number; // expiration
  // TODO add multifactor authentication
}

export class AuthTokens {
  accessToken: string;
  refreshToken: string;
}
