import fetchDepartmentData from './simpleDepartmentData';
import fetchUserData from './simpleUserData';
import labelData from '../label/labelData';
import RecurrentTaskType from '../../enums/RecurrentTaskType';
import RecurrentTaskStatus from '../../enums/RecurrentTaskStatus';
import { RECURRENT_TASK } from '../../../constants/common';

const randomNumber = max => Math.round(Math.random() * max);

const randomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

const randomArrayNumberRecursively = (number, arrayData) => {
  if (!number) return arrayData;

  const eliminateIndex = randomNumber(arrayData.length - 1);
  const newArrayData = arrayData.filter(data => data.name !== arrayData[eliminateIndex].name);

  return randomArrayNumberRecursively(number - 1, newArrayData);
};

const randomEnumProperty = enumObject => {
  const enumKeys = Object.keys(enumObject);
  return enumObject[enumKeys[(enumKeys.length * Math.random()) << 0]];
};

const getRecurrentTaskData = async () => {
  const simpleUserData = await fetchUserData();
  const simpleDepartmentData = await fetchDepartmentData();

  const recurrentTaskData = Array.from({ length: RECURRENT_TASK.SEED_LENGTH }, () => {

    const taskIndex = randomNumber(1000);
    const name = `Task ${taskIndex}`;

    const description = `Let finish your task ${taskIndex}`;

    const creator = simpleUserData[randomNumber(simpleUserData.length - 1)];

    const type = randomEnumProperty(RecurrentTaskType);

    let doer;
    let coDoers = [];
    let reviewer;
    let department;
    let coDepartments = [];

    if (type === RecurrentTaskType.INDIVIDUAL) {
      doer = simpleUserData[randomNumber(simpleUserData.length - 1)];

      const userArrayEliminatedDoer = simpleUserData.filter(
        element => element.id !== doer.id
      );
      coDoers = randomArrayNumberRecursively(
        randomNumber(simpleUserData.length - 2),
        userArrayEliminatedDoer
      );

      do {
        reviewer = simpleUserData[randomNumber(simpleUserData.length - 1)];
      } while (reviewer.id === doer.id);
    }
    else if (type === RecurrentTaskType.DEPARTMENT) {
      department =
        simpleDepartmentData[randomNumber(simpleDepartmentData.length - 1)];

      const departmentArrayEliminatedPreviousDepartment = simpleDepartmentData.filter(
        element => element.id !== department.id
      );
      coDepartments = randomArrayNumberRecursively(
        randomNumber(simpleDepartmentData.length - 2),
        departmentArrayEliminatedPreviousDepartment
      );

      reviewer = simpleUserData[randomNumber(simpleUserData.length - 1)];
    }

    const labels = randomArrayNumberRecursively(
      randomNumber(labelData.length - 1),
      labelData
    ).map(label => label._id);

    const isTaskCompleted = randomNumber(100) <= RECURRENT_TASK.PERCENT_TOTAL_TASK_COMPLETE;

    let percentComplete;
    let start;
    let finish;
    let due;
    let status;

    if (isTaskCompleted) {
      percentComplete = 100;

      start = randomDate(RECURRENT_TASK.START_DATE, new Date());

      finish = randomDate(start, RECURRENT_TASK.DUE_DATE);

      due = randomDate(start, finish);

      status = RecurrentTaskStatus.FINISHED;
    }
    else {
      percentComplete = randomNumber(99);

      start = randomDate(RECURRENT_TASK.START_DATE, new Date());

      due = randomDate(start, RECURRENT_TASK.DUE_DATE);

      if (new Date(due) < new Date()) {
        status = RecurrentTaskStatus.OVERDUE;
      }
      else {
        const RecurrentTaskStatusIncompleted = {
          DOING: 'doing',
          CANCELLED: 'cancelled'
        };
        status = randomEnumProperty(RecurrentTaskStatusIncompleted);
      }
    }

    // https://www.npmjs.com/package/casual
    const comment = 'What is that?';

    return {
      name,
      description,
      creator,
      doer,
      coDoers,
      reviewer,
      department,
      coDepartments,
      labels,
      start,
      finish,
      due,
      comment,
      type,
      percentComplete,
      status
    };
  });

  return recurrentTaskData;
};

export default getRecurrentTaskData;
