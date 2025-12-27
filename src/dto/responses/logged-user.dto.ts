export interface LoginUserResponse {
  user: {
    id: string;
    username: string;
  };
  accessToken: string;
  refreshToken: string;
}
