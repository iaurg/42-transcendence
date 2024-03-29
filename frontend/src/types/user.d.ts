type UserStatus = "ONLINE" | "OFFLINE" | "AWAY";

export type User = {
  id: string;
  login: string;
  displayName: string;
  email: string;
  avatar: string | null;
  status: UserStatus;
  victory: number;
  mfaEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  friends: User[];
  blocked: User[];
};
