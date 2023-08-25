import { IUser } from './user.interface';

export interface IServiceLoginResponse {
  status: number;
  message: string;
  user: IUser | null;
}
