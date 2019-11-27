import _ from 'lodash';
import ConfigurationModels from './models';

const UpdateSearchDefaultRequestBody = _.cloneDeep(ConfigurationModels.SearchDefault.properties.SEARCH_DEFAULT);
const UpdateAPIUrlRequestBody = _.cloneDeep(ConfigurationModels.APIUrl.properties.API_URL);

export default {
  UpdateSearchDefaultRequestBody,
  UpdateAPIUrlRequestBody
};
