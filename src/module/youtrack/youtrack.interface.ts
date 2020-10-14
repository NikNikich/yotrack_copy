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

export interface IIdName {
  id: string;
  name?: string;
  summary?: string;
}

export interface ICustomFields {
  id: string;
  name?: string;
  value?: IIdName;
}

export interface IParent {
  issues: IIdName[];
}

export interface IIssue {
  id: string;
  summary?: string;
  parent?: IParent;
  updater: IUser;
  customFields: ICustomFields;
}
