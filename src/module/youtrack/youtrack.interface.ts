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

export interface IIssueFieldValue {
  id?: string;
  name?: string;
  localizedName?: string;
  minutes?: number;
  fullName?: string;
  login?: string;
  avatarUrl?: string;
  isResolved?: boolean;
  presentation?: string;
}

export interface ICustomFields {
  id: string;
  name?: string;
  value?: IIssueFieldValue | IIssueFieldValue[] | string | number;
}

export interface IParent {
  issues: IIdName[];
}

export interface IIssue {
  id: string;
  summary?: string;
  project?: IProject;
  parent?: IParent;
  updater: IUser;
  customFields: ICustomFields[];
}

export interface ITimeTracking {
  id: string;
  text?: string;
  duration?: IDuration;
  created?: number;
  author: IUser;
  date: number;
}

export interface IDuration {
  presentation?: string;
  minutes?: number;
}
