import {
  IIssue,
  IProject,
  ITimeTracking,
  IUser,
} from '../youtrack/youtrack.interface';

export interface IYoutrackDS {
  getListUserDS(skip?: number, top?: number): Promise<IUser[]>;
  getListProjectDS(skip?: number, top?: number): Promise<IProject[]>;
  getListIssueDS(
    skip?: number,
    top?: number,
    query?: string,
  ): Promise<IIssue[]>;
  getListIssueTrackDS(
    issueId: string,
    skip?: number,
    top?: number,
  ): Promise<ITimeTracking[]>;
  getIssueDS(issueId: string, query?: string): Promise<IIssue>;
}
