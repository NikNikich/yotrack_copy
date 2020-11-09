export const IssueFake = {
  ID: '1',
  SUMMARY: 'summary',
  PROJECT: { id: '1', name: 'Project', hubResourceId: '1' },
  PARENT: { issues: [{ id: '1', fullName: 'Ivanov I.I.', ringId: '1' }] },
  UPDATER: { id: '1', fullName: 'Ivanov I.I.', ringId: '1' },
  CUSTOM_FIELDS: { id: '1', name: 'name' },
};

export const NEW_ALWAYS_FAKE = false;
export const BD_ISSUE_Id_FAKE = 0;

export const ItemEntityFake = {
  NAME: 'name',
  YOUTRACK_ID: '1',
};

export const CustomFieldsFake = {
  ID: '1',
  NAME: 'name',
  VALUE: 'value',
};
export const TimeTrackingEntityFake = {
  TEXT: 'text',
  DURATION: 'duration',
  YOUTRACK_ID: '1',
};

export const TimeTrackingFake = {
  ID: '1',
  TEXT: 'text',
  DURATION: { presentation: '2 m' },
  CREATED: 1,
  AUTHOR: { id: '1', fullName: 'Ivanov I.I.', ringId: '1' },
  DATE: 2020,
};
