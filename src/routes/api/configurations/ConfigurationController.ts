import { RouteOptions, FastifyRequest, FastifyReply } from 'fastify';
import { ServerResponse } from 'http';
import BaseController from '@routes/BaseController';
import ConfigurationSchemaModels from '@schemas/configuration/models';
import ConfigurationSchemaRequests from '@schemas/configuration/requests';
import CommonSchemaResponses from '@schemas/common/responses';
import CONFIG from '@constants/config';
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
          description: 'Gets the application\'s current configuration',
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
        url: '/search',
        handler: this.updateSearchDefault,
        schema: {
          tags: [TAGS.CONFIGURATIONS],
          description: 'Updates search-related configuration',
          body: ConfigurationSchemaRequests.UpdateSearchDefaultRequestBody,
          response: {
            200: ConfigurationSchemaModels.SearchDefault,
            400: CommonSchemaResponses.BadRequest400Response,
            404: CommonSchemaResponses.ResourceNotFound404Response
          }
        }
      },
      {
        method: 'PUT',
        url: '/api-urls',
        handler: this.updateAPIUrls,
        schema: {
          tags: [TAGS.CONFIGURATIONS],
          description: 'Updates the external API endpoints',
          body: ConfigurationSchemaRequests.UpdateAPIUrlRequestBody,
          response: {
            200: ConfigurationSchemaModels.APIUrl,
            400: CommonSchemaResponses.BadRequest400Response,
            404: CommonSchemaResponses.ResourceNotFound404Response
          }
        }
      }
    ];
  }

  private async getConfiguration(request: FastifyRequest, reply: FastifyReply<ServerResponse>): Promise<any> {
    reply.send(CONFIG);
  }

  private async updateSearchDefault(request: FastifyRequest, reply: FastifyReply<ServerResponse>): Promise<any> {
    for (let configKey in request.body) {
      const uppercasedConfigKey = configKey.toUpperCase();

      if (!CONFIG.SEARCH_DEFAULT.hasOwnProperty(uppercasedConfigKey)) {
        return reply.status(404).send(NotFound404.generate('Configuration not found'));
      }

      CONFIG.SEARCH_DEFAULT[uppercasedConfigKey] = request.body[configKey];
    }

    reply.send({ SEARCH_DEFAULT: CONFIG.SEARCH_DEFAULT });
  }

  private async updateAPIUrls(request: FastifyRequest, reply: FastifyReply<ServerResponse>): Promise<any> {
    for (let configKey in request.body) {
      const uppercasedConfigKey = configKey.toUpperCase();

      if (!CONFIG.API_URL.hasOwnProperty(uppercasedConfigKey)) {
        return reply.status(404).send(NotFound404.generate('Configuration not found'));
      }

      CONFIG.API_URL[uppercasedConfigKey] = request.body[configKey];
    }

    reply.send({ API_URL: CONFIG.API_URL });
  }
}

export default new ConfigurationController().initialize;
