import { IUser } from './users/user.interface';
import { Request } from 'express';

export type IAuthorizedRequest = Request & {
  user?: IUser;
};
