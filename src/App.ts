import fastify from 'fastify';
import fastifySwagger from 'fastify-swagger';
import mongoose from 'mongoose';

import APIRoutes from '@routes/Routes';
import CommonSchemaTags from '@schemas/common/tags';
import RecurrentTaskSchemaModels from '@schemas/recurrent-task/models';
import LabelSchemaModels from '@schemas/label/models';
import RecurrentTaskLog from '@services/logs/RecurrentTaskLog';
import LabelLog from '@services/logs/LabelLog';
import localPubsub from '@pubsub/LocalPubsub';

class App {
  public fastifyApp: fastify.FastifyInstance;
  public apiRoutes: APIRoutes;
  public recurrentTaskLog: RecurrentTaskLog;
  public labelLog: LabelLog;

  constructor() {
    this.fastifyApp = fastify({
      logger: { prettyPrint: true }
    });
    this.apiRoutes = new APIRoutes(this.fastifyApp);

    this.connectToDatabase();
    this.configPreRouteMiddlewares();
    this.setUpSwagger();
    this.setUpAPIRoutes();
    this.configPostRouteMiddlewares();
    this.setUpLogging();
  }

  private configPreRouteMiddlewares(): void {
    this.fastifyApp.register(require('fastify-cors'));
  }

  private configPostRouteMiddlewares(): void {

  }

  private async connectToDatabase(): Promise<any> {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/rtms';

    try {
      this.fastifyApp.log.info('Connecting to MongoDB...');
      await mongoose.connect(mongoURI, { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false });
      this.fastifyApp.log.info('MongoDB connected.');
    } catch (err) {
      this.fastifyApp.log.error('Could not connect to MongoDB.', err);
    }
  }

  private setUpSwagger() {
    this.fastifyApp.log.info('Generating Swagger Docs...');

    this.fastifyApp.register(fastifySwagger, {
      swagger: {
        info: {
          title: 'Recurrent Task Microservice - API Documentation',
          version: '0.1.2',
          description: 'This is the API documentation for the microservice managing recurrent tasks.'
        },
        consumes: ['application/json'],
        produces: ['application/json'],
        tags: CommonSchemaTags,
        definitions: {
          RecurrentTask: RecurrentTaskSchemaModels.RecurrentTask,
          Label: LabelSchemaModels.Label
        }
      },
      exposeRoute: true,
      routePrefix: '/api-docs'
    });

    this.fastifyApp.log.info('Swagger Docs is successfully generated and available at /api-docs.');
  }

  private setUpAPIRoutes(): void {
    this.apiRoutes.initialize();
  }

  private setUpLogging(): void {
    this.recurrentTaskLog = new RecurrentTaskLog(localPubsub, this.fastifyApp.log);
    this.recurrentTaskLog.listen();

    this.labelLog = new LabelLog(localPubsub, this.fastifyApp.log);
    this.labelLog.listen();
  }
}

export default new App().fastifyApp;
