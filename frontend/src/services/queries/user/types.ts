export type UserData = {
  displayName: string;
  status: "ONLINE" | "OFFLINE" | "AWAY" | "BUSY";
  avatar: string;
  victory: number;
  refreshToken?: string;
};
