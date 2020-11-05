import { IProjectTeam } from '../hub/hub.interface';

export interface IQueryProjectTeam {
  type?: string;
  next?: string;
  skip?: number;
  top?: number;
  projecteams: IProjectTeam[];
}
