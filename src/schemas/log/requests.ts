import LogSchemaModels from './models';
import _ from 'lodash';

const GetLogRequest = {
  description: 'The query params to get task logs',
  type: 'object',
  properties: {
    start: {
      type: 'string',
      format: 'date-time'
    },
    end: {
      type: 'string',
      format: 'date-time'
    },
    executerId: {
      type: 'string',
      example: '523f1f77bcf86cd799439022'
    },
    resourceType: LogSchemaModels.ResourceType,
    operation: LogSchemaModels.ResourceOperation
  }
};

const GetTaskLogRequest = _.cloneDeep(GetLogRequest);

GetTaskLogRequest.properties.resourceType = {
  description: 'The type of the resource(s)',
  type: 'string',
  enum: ['task']
};

const GetLabelLogRequest = _.cloneDeep(GetLogRequest);

GetTaskLogRequest.properties.resourceType = {
  description: 'The type of the resource(s)',
  type: 'string',
  enum: ['label']
};

export default {
  GetLogRequest,
  GetTaskLogRequest,
  GetLabelLogRequest
};
