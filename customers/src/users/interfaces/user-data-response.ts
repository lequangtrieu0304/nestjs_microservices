import { IUser } from './user.interface';

export interface IUserDataResponse {
  status: number;
  message?: string;
  user: IUser | null;
}
