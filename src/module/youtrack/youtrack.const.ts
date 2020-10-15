export const USER_LIST_FIELDS = 'id,fullName,ringId';
export const PROJECT_LIST_FIELDS = 'id,name,hubResourceId';
export const ISSUE_LIST_FIELDS = 'id,summary,parent(issues(id,summary)),updater(id,fullName),' +
  'customFields(id,name,value(name,id))';
export const DELAY_MS = 10;
export const ISSUE_CUSTOM_FIELDS = {
  'Estimation': 'estimationTime',
  'Spent time': "spentTime",
  '% выполнения': "percent",
  'Fix versions': "fixVersions",
  'Start date': "startDate",
  'End date': "endDate",
  'Direction': "endDate",
  'Assignee': "assigneeUserId",
};
