import { SafeUser } from './safe-user.interface';

export interface LoginResponse {
  accessToken: string;
  user: SafeUser;
}
