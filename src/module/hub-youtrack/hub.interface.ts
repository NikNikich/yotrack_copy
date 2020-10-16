import { ICustomFields, IParent, IUser } from '../youtrack/youtrack.interface';

export interface IProjectTeam {
  id: string;
  summary?: string;
  parent?: IParent;
  updater: IUser;
  customFields: ICustomFields[];
}