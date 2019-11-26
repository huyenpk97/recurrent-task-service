import { prop, arrayProp, getModelForClass, Ref, pre, post } from '@typegoose/typegoose';
import { Label } from './Label';
import RecurrentTaskStatus from './enums/RecurrentTaskStatus';
import SimpleUser from './pojo/SimpleUser';
import SimpleDepartment from './pojo/SimpleDepartment';
import RecurrentTaskType from './enums/RecurrentTaskType';
import localPubsub from '../pubsub/LocalPubsub';
import { RECURRENT_TASK_EVENT } from '../constants/events';
import RecurrentTaskService from '@services/recurrent-tasks/RecurrentTaskService';

@pre<RecurrentTask>('save', function(next) {
  RecurrentTaskService.ensureRecurrentTaskValidity(this);
  next();
})
@pre<RecurrentTask>('findOneAndUpdate', async function(next) {
  const oldRecurrentTask = await RecurrentTaskModel.findOne(this.getQuery());
  const newRecurrentTask = RecurrentTaskService.ensureRecurrentTaskValidityOnUpdate(oldRecurrentTask._doc, this._update);

  Object.keys(this._update).forEach(fieldToBeUpdated => {
    this._update[fieldToBeUpdated] = newRecurrentTask[fieldToBeUpdated];
  });

  next();
})
@post<RecurrentTask>('save', recurrentTask => {
  localPubsub.emit(RECURRENT_TASK_EVENT.CREATED, recurrentTask);
})
@post<RecurrentTask>('findOneAndUpdate', updatedRecurrentTask => {
  localPubsub.emit(RECURRENT_TASK_EVENT.UPDATED, updatedRecurrentTask);
})
@post<RecurrentTask>('remove', deletedRecurrentTask => {
  localPubsub.emit(RECURRENT_TASK_EVENT.DELETED, deletedRecurrentTask);
})
class RecurrentTask {
  @prop({ required: true })
  public name!: string;

  @prop({ required: true })
  public description!: string;

  @prop({ required: true })
  public creator!: SimpleUser;

  @prop({ _id: false })
  public doer?: SimpleUser;

  @arrayProp({ items: SimpleUser, _id: false })
  public coDoers?: SimpleUser[];

  @prop({ _id: false })
  public reviewer?: SimpleUser;

  @prop({ _id: false })
  public department?: SimpleDepartment;

  @arrayProp({ items: SimpleDepartment, _id: false })
  public coDepartments: SimpleDepartment[];

  @arrayProp({ itemsRef: Label })
  public labelIds: Ref<Label>[];

  @prop()
  public start?: Date;

  @prop()
  public finish?: Date;

  @prop()
  public due?: Date;

  @prop()
  public comment?: string;

  @prop({ enum: RecurrentTaskType })
  public type!: RecurrentTaskType;

  @prop({ min: 0, max: 100 })
  public percentComplete?: number;

  @prop({ enum: RecurrentTaskStatus, default: RecurrentTaskStatus.DOING })
  public status?: RecurrentTaskStatus;
}

const RecurrentTaskModel = getModelForClass(RecurrentTask);

export { RecurrentTask, RecurrentTaskModel };

export default RecurrentTaskModel;
