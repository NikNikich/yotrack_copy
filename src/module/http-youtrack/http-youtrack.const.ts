export const USER_LIST_FIELDS = 'id,fullName,ringId';
export const PROJECT_LIST_FIELDS = 'id,name,hubResourceId';
export const ISSUE_LIST_FIELDS =
  'id,summary,parent(issues(id,summary)),updater(id,fullName),project(id,name,hubResourceId),' +
  'customFields(id,name,value(name,id,localizedName,fullName,login,avatarUrl,isResolved,minutes,presentation))';
export const ISSUE_LIST_QUERY = 'updated:{This month}';
export const TRACK_LIST_FIELDS =
  'id,author(id,fullName),duration(presentation),created,date,text';
