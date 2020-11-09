export const UserFake = {
  ID: '1',
  FULL_NAME: 'Ivanov I.I.',
  RING_ID: '1',
};

export const ProjectFake = {
  ID: '1',
  NAME: 'Project',
  HUB_RESOURCE_ID: '1',
};

export const IssuesFake = {
  ID: '1',
  SUMMARY: 'summary',
  PROJECT: { id: '1', name: 'Project', hubResourceId: '1' },
  PARENT: { issues: [{ id: '1', fullName: 'Ivanov I.I.', ringId: '1' }] },
  UPDATER: { id: '1', fullName: 'Ivanov I.I.', ringId: '1' },
  CUSTOM_FIELDS: { id: '1', name: 'name' },
};

export const IssuesTrackFake = {
  ID: '1',
  TEXT: 'text',
  DURATION: { presentation: '2 m' },
  CREATED: 1,
  AUTHOR: { id: '1', fullName: 'Ivanov I.I.', ringId: '1' },
  DATE: 2020,
};

export const ConfigFake = {
  HEADERS: 'header',
  PARAMS: 'params',
};
