import { prop, arrayProp, getModelForClass, Ref } from '@typegoose/typegoose';
import { Label } from './Label';

class SimpleUser {
  @prop({ required: true })
  public uid!: string;

  @prop({ required: true })
  public name!: string;

  @prop()
  public email?: string;
}

enum RecurrentTaskStatus {
  PENDING = 'pending',
  DOING = 'doing',
  FINISHED = 'finished',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled'
}

class RecurrentTask {
  @prop({ required: true })
  public name!: string;

  @prop({ required: true })
  public description!: string;

  @prop({ required: true })
  public creator!: SimpleUser;

  @arrayProp({ items: SimpleUser })
  public doers?: SimpleUser[];

  @prop()
  public reviewer?: SimpleUser;

  @arrayProp({ itemsRef: Label })
  public labelIDs: Ref<Label>[];

  @prop()
  public start?: Date;

  @prop()
  public finish?: Date;

  @prop()
  public due?: Date;

  @prop({ enum: RecurrentTaskStatus, default: RecurrentTaskStatus.PENDING }) 
  public status?: RecurrentTaskStatus;
}

const RecurrentTaskModel = getModelForClass(RecurrentTask);

export { RecurrentTask, RecurrentTaskModel };

export default RecurrentTaskModel;
