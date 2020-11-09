import { IProjectTeam } from '../hub/hub.interface';

export interface IQueryProjectTeam {
  type?: string;
  next?: string;
  skip?: number;
  top?: number;
  projectteams: IProjectTeam[];
}

export interface IHubDS {
  getListProjectTeam(skip?: number, top?: number): Promise<IProjectTeam[]>;
}
