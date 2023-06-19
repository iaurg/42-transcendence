export interface JwtPayload {
  sub: string; // login
  email: string; // email
  mfaEnabled: boolean;
  mfaAuthenticated: boolean;
  iat?: number; // issued at
  exp?: number; // expiration
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
