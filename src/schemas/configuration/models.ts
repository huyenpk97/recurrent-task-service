const Configuration = {
  description: 'A recurrent task Configuration',
  type: 'object',
  required: [],
  properties: {
    SEARCH_OFFSET: {
      type: 'number',
      example: 0
    },
    SEARCH_LIMIT: {
      type: 'number',
      example: 40
    }
  }
};

export default {
  Configuration
};
