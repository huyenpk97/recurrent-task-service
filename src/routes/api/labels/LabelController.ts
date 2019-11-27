import { RouteOptions, FastifyRequest, FastifyReply } from 'fastify';
import { ServerResponse } from 'http';
import BaseController from '@routes/BaseController';
import LabelModel from '@models/Label';
import LabelSchemaModels from '@schemas/label/models';
import LabelSchemaRequests from '@schemas/label/requests';
import CommonSchemaRequests from '@schemas/common/requests';
import CommonSchemaResponses from '@schemas/common/responses';
import { TAGS } from '@schemas/common/tags';
import NotFound404 from '@models/responses/NotFound404';
import { CONFIGURATION } from '@constants/common';

class LabelController extends BaseController {
  public getRoutes(): RouteOptions[] {
    return [
      {
        method: 'POST',
        url: '/',
        handler: this.createLabel,
        schema: {
          tags: [TAGS.LABELS],
          description: 'Creates a new label',
          body: LabelSchemaRequests.CreateLabelRequestBody,
          response: {
            200: LabelSchemaModels.Label,
            400: CommonSchemaResponses.BadRequest400Response
          }
        }
      },
      {
        method: 'GET',
        url: '/:labelId',
        handler: this.getLabel,
        schema: {
          tags: [TAGS.LABELS],
          description: 'Gets detailed information about a specific label',
          response: {
            200: LabelSchemaModels.Label,
            401: CommonSchemaResponses.Unauthorized401Response,
            403: CommonSchemaResponses.ForbiddenAccess403Response,
            404: CommonSchemaResponses.ResourceNotFound404Response
          }
        }
      },
      {
        method: 'PUT',
        url: '/:labelId',
        handler: this.updateLabel,
        schema: {
          tags: [TAGS.LABELS],
          description: 'Updates an existing label',
          body: LabelSchemaRequests.UpdateLabelRequestBody,
          response: {
            200: LabelSchemaModels.Label,
            400: CommonSchemaResponses.BadRequest400Response,
            404: CommonSchemaResponses.ResourceNotFound404Response
          }
        }
      },
      {
        method: 'DELETE',
        url: '/:labelId',
        handler: this.deleteLabel,
        schema: {
          tags: [TAGS.LABELS],
          description: 'Deletes an existing label',
          response: {
            200: LabelSchemaModels.Label,
            401: CommonSchemaResponses.Unauthorized401Response,
            403: CommonSchemaResponses.ForbiddenAccess403Response,
            404: CommonSchemaResponses.ResourceNotFound404Response
          }
        }
      },
      {
        method: 'POST',
        url: '/search',
        handler: this.searchLabels,
        schema: {
          tags: [TAGS.LABELS],
          description: 'Searches for labels',
          querystring: CommonSchemaRequests.PaginationQueryParams,
          body: LabelSchemaRequests.SearchLabelRequestBody,
          response: {
            200: {
              type: 'array',
              items: LabelSchemaModels.Label
            },
            400: CommonSchemaResponses.BadRequest400Response,
            401: CommonSchemaResponses.Unauthorized401Response
          }
        }
      }
    ];
  }

  private async createLabel(request: FastifyRequest, reply: FastifyReply<ServerResponse>): Promise<any> {
    const { name, color } = request.body;

    const newLabel = new LabelModel({ name, color });

    await newLabel.save();

    reply.send(newLabel);
  }

  private async getLabel(request: FastifyRequest, reply: FastifyReply<ServerResponse>): Promise<any> {
    const label = await LabelModel.findById(request.params.labelId);

    if (!label) {
      return reply.status(404).send(NotFound404.generate(`Label with the requested ID '${request.params.labelId}' was not found`));
    }

    reply.send(label);
  }

  private async updateLabel(request: FastifyRequest, reply: FastifyReply<ServerResponse>): Promise<any> {
    const label = await LabelModel.findOneAndUpdate({ _id: request.params.labelId }, request.body, { new: true });

    if (!label) {
      return reply.status(404).send(NotFound404.generate(`Label with the requested ID '${request.params.labelId}' was not found`));
    }

    reply.send(label);
  }

  private async deleteLabel(request: FastifyRequest, reply: FastifyReply<ServerResponse>): Promise<any> {
    const label = await LabelModel.findById(request.params.labelId);

    if (!label) {
      return reply.status(404).send(NotFound404.generate(`Label with the requested ID '${request.params.labelId}' was not found`));
    }

    await label.remove();

    reply.send(label);
  }

  private async searchLabels(request: FastifyRequest, reply: FastifyReply<ServerResponse>): Promise<any> {
    const { offset, limit } = request.query;

    const labels = await LabelModel.find(request.body)
      .skip(Number(offset) || CONFIGURATION.SEARCH_OFFSET)
      .limit(Number(limit) || CONFIGURATION.SEARCH_LIMIT)
      .lean();

    reply.send(labels);
  }
}

export default new LabelController().initialize;
