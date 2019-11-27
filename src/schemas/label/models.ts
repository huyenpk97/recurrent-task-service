const Label = {
  description: 'A recurrent task label',
  type: 'object',
  required: [
    '_id',
    'name',
    'color'
  ],
  properties: {
    _id: {
      type: 'string',
      example: '507f1f77bcf86cd799439011'
    },
    name: {
      type: 'string',
      example: 'Major'
    },
    color: {
      type: 'string',
      example: '#ff0000'
    }
  }
};

export default {
  Label
};
