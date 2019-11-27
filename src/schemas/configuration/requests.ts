import _ from 'lodash';
import ConfigurationModels from './models';

const UpdateConfigurationRequestBody = _.cloneDeep(ConfigurationModels.Configuration);
UpdateConfigurationRequestBody.required = ['name', 'value'];

UpdateConfigurationRequestBody.description = 'The request body when updating configuration';

export default {
  UpdateConfigurationRequestBody,
};
