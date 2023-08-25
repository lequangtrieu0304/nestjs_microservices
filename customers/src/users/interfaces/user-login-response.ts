import { IUser } from './user.interface';

export interface IUserLoginResponse {
  status: number;
  message: string;
  user: IUser | null;
}
