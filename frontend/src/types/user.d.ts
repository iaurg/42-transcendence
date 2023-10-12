type UserStatus = "ONLINE" | "OFFLINE" | "AWAY";

export type User = {
  id: string;
  login: string;
  displayName: string;
  email: string;
  avatar: string | null;
  status: UserStatus;
  victory: number;
  refreshToken: string | null;
  mfaEnabled: boolean;
  mfaSecret: string | null;
  createdAt: Date;
  updatedAt: Date;
};
