const Configuration = {
  description: 'The configuration of the application',
  type: 'object',
  properties: {
    SEARCH_DEFAULT: {
      type: 'object',
      properties: {
        OFFSET: {
          type: 'number',
          default: 0,
          example: 0
        },
        LIMIT: {
          type: 'number',
          default: 40,
          example: 40
        }
      }
    },
    API_URL: {
      type: 'object',
      properties: {
        GET_USERS: {
          type: 'string'
        },
        GET_DEPARTMENTS: {
          type: 'string'
        }
      }
    }
  }
};

const SearchDefault = {
  description: 'The search-related configuration of the application',
  type: 'object',
  properties: {
    SEARCH_DEFAULT: Configuration.properties.SEARCH_DEFAULT
  }
};

const APIUrl = {
  description: 'The urls of external API endpoints',
  type: 'object',
  properties: {
    API_URL: Configuration.properties.API_URL
  }
};

export default {
  Configuration,
  SearchDefault,
  APIUrl
};
