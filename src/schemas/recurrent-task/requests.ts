import _ from 'lodash';
import RecurrentTaskSchemaModels from './models';
import CommonSchemaModels from '@schemas/common/models';

const CreateRecurrentTaskRequestBody = _.cloneDeep(RecurrentTaskSchemaModels.RecurrentTask);

CreateRecurrentTaskRequestBody.description = 'The request body when creating a new recurrent task';
CreateRecurrentTaskRequestBody.required = ['name', 'description'];
delete CreateRecurrentTaskRequestBody.properties._id;

const UpdateRecurrentTaskRequestBody = _.cloneDeep(CreateRecurrentTaskRequestBody);

UpdateRecurrentTaskRequestBody.description = 'The request body when updating an existing recurrent task';
delete UpdateRecurrentTaskRequestBody.required;

const SearchRecurrentTaskRequestBody = {
  description: 'The request body to search for recurrent tasks',
  type: 'object',
  properties: {
    query: {
      type: 'string',
      example: 'drugs'
    },
    creators: CommonSchemaModels.ListOfUserEmails,
    doers: CommonSchemaModels.ListOfUserEmails,
    departments: CommonSchemaModels.ListOfDepartmentNames,
    reviewers: CommonSchemaModels.ListOfUserEmails,
    start: {
      type: 'string',
      format: 'date-time'
    },
    finish: {
      type: 'string',
      format: 'date-time'
    },
    status: {
      type: 'array',
      items: RecurrentTaskSchemaModels.RecurrentTaskStatus
    }
  }
};

const GetRecurrentTasksQueryParams = {
  type: 'object',
  properties: {
    start: {
      type: 'string',
      format: 'date-time'
    },
    finish: {
      type: 'string',
      format: 'date-time'
    },
    due: {
      type: 'string',
      format: 'date-time'
    }
  }
};

const GetRecurrentTasksWithinTimeMarksQueryParams = {
  type: 'object',
  properties: {
    week: {
      type: 'number',
      minimum: 1,
      maximum: 4
    },
    month: {
      type: 'number',
      minimum: 1,
      maximum: 12
    },
    year: {
      type: 'number',
      minimum: 0
    }
  }
};

export default {
  CreateRecurrentTaskRequestBody,
  UpdateRecurrentTaskRequestBody,
  SearchRecurrentTaskRequestBody,
  GetRecurrentTasksQueryParams,
  GetRecurrentTasksWithinTimeMarksQueryParams
};
