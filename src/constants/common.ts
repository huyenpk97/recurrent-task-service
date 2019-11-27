export const DEFAULT_USER = {
  id: 'default',
  name: 'Default User',
  email: 'defaultuser@default.com'
};

export const RECURRENT_TASK = {
  SEED_LENGTH: 50,
  PERCENT_TOTAL_TASK_COMPLETE: 80,
  START_DATE: new Date(2019, 10, 15),
  DUE_DATE: new Date(2019, 11, 15)
}

export const CONFIGURATION = {
  SEARCH_OFFSET: 0,
  SEARCH_LIMIT: 40,
  GET_USERS: 'https://dsd05-dot-my-test-project-252009.appspot.com/user/getUserInfos',
  GET_DEPARTMENTS: 'http://18.217.21.235:8083/api/v1/organizationalStructure/listOrganization'
}