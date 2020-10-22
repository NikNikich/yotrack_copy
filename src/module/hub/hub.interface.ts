import { ICustomFields, IIdName, IParent, IUser } from '../youtrack/youtrack.interface';

export interface IProjectHub {
  id: string;
  name?: string;
  resource?: IIdName[];
}

export interface IProjectTeam {
  id: string;
  name?: string;
  users?: IIdName[];
  project: IProjectHub;
}