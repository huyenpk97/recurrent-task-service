import { RouteOptions, FastifyRequest, FastifyReply } from 'fastify';
import { ServerResponse } from 'http';
import BaseController from '@routes/BaseController';
import ConfigurationSchemaModels from '@schemas/configuration/models';
import ConfigurationSchemaRequests from '@schemas/configuration/requests';
import CommonSchemaResponses from '@schemas/common/responses';
import { CONFIGURATION } from '@constants/common';
import { TAGS } from '@schemas/common/tags';
import NotFound404 from '@models/responses/NotFound404';

class ConfigurationController extends BaseController {
  public getRoutes(): RouteOptions[] {
    return [
      {
        method: 'GET',
        url: '/',
        handler: this.getConfiguration,
        schema: {
          tags: [TAGS.CONFIGURATIONS],
          description: 'Gets detailed information about configuration',
          response: {
            200: ConfigurationSchemaModels.Configuration,
            401: CommonSchemaResponses.Unauthorized401Response,
            403: CommonSchemaResponses.ForbiddenAccess403Response,
            404: CommonSchemaResponses.ResourceNotFound404Response
          }
        }
      },
      {
        method: 'PUT',
        url: '/',
        handler: this.updateConfiguration,
        schema: {
          tags: [TAGS.CONFIGURATIONS],
          description: 'Updates configuration',
          body: ConfigurationSchemaRequests.UpdateConfigurationRequestBody,
          response: {
            200: ConfigurationSchemaModels.Configuration,
            304: CommonSchemaResponses.NotModified304Response,
            400: CommonSchemaResponses.BadRequest400Response,
            404: CommonSchemaResponses.ResourceNotFound404Response
          }
        }
      }
    ];
  }

  private async getConfiguration(request: FastifyRequest, reply: FastifyReply<ServerResponse>): Promise<any> {
    reply.send(JSON.stringify(CONFIGURATION));
  }

  private async updateConfiguration(request: FastifyRequest, reply: FastifyReply<ServerResponse>): Promise<any> {

    const { name, value } = request.body;

    const upperCaseConfigurationName = name.toUpperCase();
    let isConfigurationUpdated = false;

    if (!CONFIGURATION[upperCaseConfigurationName]) {
      return reply.status(404).send(NotFound404.generate('Can not found configuration'));
    }

    if (value && value !== CONFIGURATION[upperCaseConfigurationName]) {
      CONFIGURATION[upperCaseConfigurationName] = value;
      isConfigurationUpdated = true;
    }

    if (!isConfigurationUpdated) {
      return reply.status(304).send({
        statusCode: 304,
        message: 'The requested configuration was not modified'
      });
    }

    reply.send(JSON.stringify(CONFIGURATION));
  }
}

export default new ConfigurationController().initialize;
