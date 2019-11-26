import { RECURRENT_TASK_EVENT } from '../../constants/events';
import LogModel from '../../models/Log';
import ResourceType from '../../models/enums/ResourceType';
import ResourceOperation from '../../models/enums/ResourceOperation';
import { DEFAULT_USER } from '../../constants/common';

class RecurrentTaskLog {
  private pubsub: any;
  private logger: any;

  constructor(pubsub, logger) {
    this.pubsub = pubsub;
    this.logger = logger;
  }

  public listen(): void {
    this.pubsub.on(RECURRENT_TASK_EVENT.CREATED, this.onTaskCreated.bind(this));
    this.pubsub.on(RECURRENT_TASK_EVENT.UPDATED, this.onTaskUpdated.bind(this));
    this.pubsub.on(RECURRENT_TASK_EVENT.DELETED, this.onTaskDeleted.bind(this));
  }

  private onTaskCreated(recurrentTask): void {
    this.logger.info('A recurrent task has just been created!', recurrentTask);

    const newLog = new LogModel({ 
      resourceIds: [recurrentTask._id],
      resourceType: ResourceType.TASK,
      operation: ResourceOperation.CREATE,
      executer: DEFAULT_USER,
      details: {
        createdTask: recurrentTask
      }
    });

    newLog.save();
  }

  private onTaskUpdated(recurrentTask): void {
    this.logger.info('A recurrent task has just been updated!', recurrentTask);

    const newLog = new LogModel({ 
      resourceIds: [recurrentTask._id],
      resourceType: ResourceType.TASK,
      operation: ResourceOperation.UPDATE,
      executer: DEFAULT_USER,
      details: {
        updatedTask: recurrentTask
      }
    });

    newLog.save();
  }

  private onTaskDeleted(recurrentTask): void {
    this.logger.info('A recurrent task has just been deleted!', recurrentTask);

    const newLog = new LogModel({ 
      resourceIds: [recurrentTask._id],
      resourceType: ResourceType.TASK,
      operation: ResourceOperation.DELETE,
      executer: DEFAULT_USER,
      details: {
        deletedTask: recurrentTask
      }
    });

    newLog.save();
  }
}

export default RecurrentTaskLog;
