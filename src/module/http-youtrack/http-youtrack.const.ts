export const USER_LIST_FIELDS = 'id,fullName,ringId';
export const PROJECT_LIST_FIELDS = 'id,name,hubResourceId';
export const ISSUE_LIST_FIELDS = 'id,summary,parent(issues(id,summary)),updater(id,fullName),project(id),' +
  'customFields(id,name,value(name,id,localizedName,fullName,login,avatarUrl,isResolved,presentation))';
export const ISSUE_LIST_QUERY = 'updated:Yesterday';
export const TRACK_LIST_FIELDS = "id,author(id,fullName),duration(presentation),created,date,text";