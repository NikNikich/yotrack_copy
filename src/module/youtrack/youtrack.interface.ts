import { IPermission } from '../observer/observer.interfaces';

export interface IUser {
  id: string;
  fullName?: string;
  ringId?: string;
}

export interface IProject {
  id: string;
  name?: string;
  hubResourceId?: string;
}
