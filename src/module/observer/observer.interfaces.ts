export interface IPermission {
  id: string;
  name?: string;
}

export interface IRole {
  id: string;
  name?: string;
  permissions?: IPermission;
}