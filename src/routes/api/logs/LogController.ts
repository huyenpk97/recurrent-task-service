import { RouteOptions, FastifyRequest, FastifyReply } from 'fastify';
import { ServerResponse } from 'http';
import BaseController from '@routes/BaseController';
import LogSchemaModels from '@schemas/log/models';
import LogSchemaRequests from '@schemas/log/requests';
import { TAGS } from '@schemas/common/tags';
import LogService from '@services/logs/LogService';
import ResourceType from '@models/enums/ResourceType';

class HelloController extends BaseController {
  public getRoutes(): RouteOptions[] {
    return [
      {
        method: 'GET',
        url: '/recurrent-tasks',
        handler: this.getTaskLogs,
        schema: {
          tags: [TAGS.LOGS],
          querystring: LogSchemaRequests.GetTaskLogRequest,
          response: {
            200: {
              type: 'array',
              items: LogSchemaModels.Log
            }
          }
        }
      },
      {
        method: 'GET',
        url: '/labels',
        handler: this.getLabelLogs,
        schema: {
          tags: [TAGS.LOGS],
          querystring: LogSchemaRequests.GetLabelLogRequest,
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
    const { executerId, operation, start, end } = request.query;

    const logs = await LogService.getLogsWithinTimeRange(start, end, { resourceType: ResourceType.TASK, executerId, operation });

    reply.send(logs);
  }

  private async getLabelLogs(request: FastifyRequest, reply: FastifyReply<ServerResponse>): Promise<any> {
    const { executerId, operation, start, end } = request.query;

    const logs = await LogService.getLogsWithinTimeRange(start, end, { resourceType: ResourceType.LABEL, executerId, operation });

    reply.send(logs);
  }
}

export default new HelloController().initialize;
