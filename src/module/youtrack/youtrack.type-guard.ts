import { IIssueFieldValue } from './youtrack.interface';

export const isIIssueFieldValue = (arg: any): arg is IIssueFieldValue => {
  return arg.id !== undefined;
};
