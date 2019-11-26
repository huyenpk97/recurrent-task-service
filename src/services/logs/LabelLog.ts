import { LABEL_EVENT } from '../../constants/events';
import LogModel from '../../models/Log';
import ResourceType from '../../models/enums/ResourceType';
import ResourceOperation from '../../models/enums/ResourceOperation';
import { DEFAULT_USER } from '../../constants/common';

class LabelLog {
  private pubsub: any;
  private logger: any;

  constructor(pubsub, logger) {
    this.pubsub = pubsub;
    this.logger = logger;
  }

  public listen(): void {
    this.pubsub.on(LABEL_EVENT.CREATED, this.onLabelCreated.bind(this));
    this.pubsub.on(LABEL_EVENT.UPDATED, this.onLabelUpdated.bind(this));
    this.pubsub.on(LABEL_EVENT.DELETED, this.onLabelDeleted.bind(this));
  }

  private onLabelCreated(label): void {
    this.logger.info('A label has just been created!', label);

    const newLog = new LogModel({ 
      resourceIds: [label._id],
      resourceType: ResourceType.LABEL,
      operation: ResourceOperation.CREATE,
      executer: DEFAULT_USER,
      details: {
        createdLabel: label
      }
    });

    newLog.save();
  }

  private onLabelUpdated(label): void {
    this.logger.info('A label has just been updated!', label);

    const newLog = new LogModel({ 
      resourceIds: [label._id],
      resourceType: ResourceType.LABEL,
      operation: ResourceOperation.UPDATE,
      executer: DEFAULT_USER,
      details: {
        updatedLabel: label
      }
    });

    newLog.save();
  }

  private onLabelDeleted(label): void {
    this.logger.info('A label has just been deleted!', label);

    const newLog = new LogModel({ 
      resourceIds: [label._id],
      resourceType: ResourceType.LABEL,
      operation: ResourceOperation.DELETE,
      executer: DEFAULT_USER,
      details: {
        deletedLabel: label
      }
    });

    newLog.save();
  }
}

export default LabelLog;
