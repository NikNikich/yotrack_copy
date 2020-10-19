import { ICustomFields, IIdName, IParent, IUser } from '../youtrack/youtrack.interface';

export const PROJECT_TEAMS_LIST_FIELDS = "id,name,users(id,name),project(id,name,resources(id,name))";

export interface IProjectHub {
  id: string;
  name?: string;
  resource?: IIdName;
}

export interface IProjectTeam {
  id: string;
  name?: string;
  users?: IIdName;
  project: IProjectHub;
}