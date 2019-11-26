import CommonSchemaModels from '@schemas/common/models';

const ResourceType = {
  description: 'The type of the resource(s)',
  type: 'string',
  enum: [
    'task',
    'label'
  ]
};

const ResourceOperation = {
  description: 'The type of operation on the resource(s)',
  type: 'string',
  enum: [
    'create',
    'update',
    'delete',
    'get',
    'search'
  ]
};

const Log = {
  description: 'A log about resource operation history',
  type: 'object',
  required: [
    '_id',
    'resourceIds',
    'resourceType',
    'operation',
    'executer'
  ],
  properties: {
    _id: {
      type: 'string',
      example: '523d231e810c19729de670cd'
    },
    resourceIds: {
      type: 'array',
      items: {
        type: 'string',
        example: '507f191e810c19729de860ea'
      }
    },
    resourceType: ResourceType,
    operation: ResourceOperation,
    description: {
      type: 'string',
      example: 'The tasks were deleted due to wrong nomination.'
    },
    details: {
      type: 'object',
      description: 'This may contain details about the resource(s).',
      additionalProperties: true
    },
    executer: CommonSchemaModels.SimpleUser,
    timestamp: {
      type: 'string',
      format: 'date-time',
      description: 'Date in UTC when the task is due'
    },
  }
};

export default {
  ResourceType,
  ResourceOperation,
  Log
};
