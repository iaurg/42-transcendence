export interface TokenPayload {
  sub: string; // user id
  mfaEnabled: boolean;
  mfaAuthenticated: boolean;
}
