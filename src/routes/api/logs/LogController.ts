import { RouteOptions, FastifyRequest, FastifyReply } from 'fastify';
import { ServerResponse } from 'http';
import BaseController from '@routes/BaseController';
import LogSchemaModels from '@schemas/log/models';
import LogSchemaRequests from '@schemas/log/requests';
import { TAGS } from '@schemas/common/tags';
import LogModel from '@models/Log';
import { SEARCH_DEFAULT } from '@constants/common';
import LogService from '@services/logs/LogService';

class HelloController extends BaseController {
  public getRoutes(): RouteOptions[] {
    return [
      {
        method: 'GET',
        url: '/',
        handler: this.getTaskLogs,
        schema: {
          tags: [TAGS.LOGS],
          querystring: LogSchemaRequests.GetLogRequest,
          response: {
            200: {
              type: 'array',
              items: LogSchemaModels.Log
            }
          }
        }
      }
    ];
  }

  private async getTaskLogs(request: FastifyRequest, reply: FastifyReply<ServerResponse>): Promise<any> {
    const { resourceType, executerId, operation, start, end } = request.query;

    const logs = await LogService.getLogsWithinTimeRange(start, end, { resourceType, executerId, operation });

    reply.send(logs);
  }
}

export default new HelloController().initialize;
