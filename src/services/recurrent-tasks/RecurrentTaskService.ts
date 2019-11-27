import RecurrentTaskModel from '@models/RecurrentTask';
import CONFIG from '@constants/config';
import RecurrentTaskStatus from '@models/enums/RecurrentTaskStatus';

class RecurrentTaskService {
  public static async searchRecurrentTasks({ offset, limit, fields, sort, body }): Promise<any> {
    const searchFields = ['name', 'description', 'status', 'type', 'comment'];

    const { creators, doers, departments, reviewers, status, start, end: finish } = body;

    const $and = [];

    if (body.query) $and.push({ $or: searchFields.map(field => ({ [field]: new RegExp(body.query, 'gi') })) });

    if (Array.isArray(creators)) $and.push({ 'creator.email': { $in: creators } });

    if (Array.isArray(doers)) $and.push({
      $or: [
        { 'doer.email': { $in: doers } },
        { coDoers: { $elemMatch: { email: { $in: doers } } } }
      ]
    });

    if (Array.isArray(departments)) {
      $and.push({
        $or: [
          {
            'department.name': {
              $in: departments
            }
          },
          {
            coDepartments: {
              $elemMatch: {
                name: {
                  $in: departments
                }
              }
            }
          }
        ]
      });
    }

    if (Array.isArray(reviewers)) $and.push({ 'reviewer.email': { $in: reviewers } });

    if (Array.isArray(status)) $and.push({ status: { $in: status } });

    if (start) $and.push({ start: { $gte: new Date(start) } });

    if (finish) $and.push({ finish: { $lt: new Date(finish) } });

    const mongoQuery: any = {};

    if ($and.length) mongoQuery.$and = $and;

    const recurrentTasks = await RecurrentTaskModel
      .find(mongoQuery)
      .sort(sort ? JSON.parse(`{${sort.map(element => {
        const field = element.substring(0, element.lastIndexOf('_'));
        const value = element.substring(element.lastIndexOf('_') + 1) === 'asc' ? 1 : -1;
        return `"${field}":${value}`;
      }).join(',')}}`) : { _id: 1 })
      .skip(offset || CONFIG.SEARCH_DEFAULT.OFFSET)
      .limit(limit || CONFIG.SEARCH_DEFAULT.LIMIT)
      .populate('labels')
      .select(fields ? JSON.parse(`{${fields.map(element => `"${element}":1`).join(',')}}`) : {})
      .lean();

    return recurrentTasks;
  }

  public static async getRecurrentTasksByUserId(userId, { start, finish, due }): Promise<any> {
    const $and = [];

    $and.push({
      $or: [
        { 'doer.id': userId }
      ]
    });

    return RecurrentTaskService.getRecurrentTasksWithinTimeRange({ start, finish, due }, $and);
  }

  public static async getRecurrentTasksByDepartmentId(departmentId, { start, finish, due }): Promise<any> {
    const $and = [];

    $and.push({
      $or: [
        { 'department.id': departmentId }
      ]
    });

    return RecurrentTaskService.getRecurrentTasksWithinTimeRange({ start, finish, due }, $and);
  }

  public static async getRecurrentTasksWithinTimeRange({ start, finish, due }, additionalCriteria?): Promise<any> {
    let $and = [];

    if (start) $and.push({ start: { $gte: new Date(start) } });

    if (finish) $and.push({ finish: { $lt: new Date(finish) } });

    if (due) $and.push({ finish: { $lt: new Date(due) } });

    if (additionalCriteria) $and = $and.concat(additionalCriteria);

    const mongoQuery: any = {};

    if ($and.length) mongoQuery.$and = $and;

    const recurrentTasks = await RecurrentTaskModel
      .find(mongoQuery)
      .sort({ start: 1 })
      .populate('labels')
      .lean();

    return recurrentTasks;
  }

  public static async getRecurrentTasksWithinTimeMarks({ week, month, year }): Promise<any> {
    const $match: any = {};

    if (week) $match.week = Number(week);
    if (month) $match.month = Number(month);
    if (year) $match.year = Number(year);

    return (await RecurrentTaskModel.aggregate([
      {
        $project: {
          rawWeek: { $add: [{ $floor: { $divide: [{ $dayOfMonth: '$start' }, 7] } }, 1] },
          start: '$start'
        }
      },
      {
        $project: {
          week: { $cond: [{ $gte: ['$rawWeek', 4] }, 4, '$rawWeek'] },
          month: { $month: '$start' },
          year: { $year: '$start' }
        }
      },
      { $match },
      {
        $lookup: {
          from: 'recurrenttasks',
          localField: '_id',
          foreignField: '_id',
          as: 'details'
        }
      }
    ])).map(el => el.details[0]);
  }

  public static ensureRecurrentTaskValidity(recurrentTask) {
    if (new Date(recurrentTask.finish) < new Date(recurrentTask.start)) {
      const error: any = new Error();
      error.statusCode = 400;
      error.message = 'The finish date of a recurrent task must be after the start date.';
      throw error;
    }

    if (new Date(recurrentTask.due) < new Date(recurrentTask.start)) {
      const error: any = new Error();
      error.statusCode = 400;
      error.message = 'The due date of a recurrent task must be after the start date.';
      throw error;
    }

    if (recurrentTask.finish && (!recurrentTask.$unset || (recurrentTask.$unset && !recurrentTask.$unset.finish))) {
      recurrentTask.status = RecurrentTaskStatus.FINISHED;
      recurrentTask.percentComplete = 100;

      return recurrentTask;
    }

    if (recurrentTask.status === RecurrentTaskStatus.FINISHED) {
      recurrentTask.percentComplete = 100;
      recurrentTask.finish = new Date();

      return recurrentTask;
    }

    if (recurrentTask.percentComplete === 100) {
      recurrentTask.status = RecurrentTaskStatus.FINISHED;
      recurrentTask.finish = new Date();

      return recurrentTask;
    }

    if (new Date(recurrentTask.due) < new Date() && recurrentTask.status !== RecurrentTaskStatus.CANCELLED) {
      recurrentTask.status = RecurrentTaskStatus.OVERDUE;
    }

    return recurrentTask;
  }

  public static ensureRecurrentTaskValidityOnUpdate(oldRecurrentTask, fieldsToBeUpdated) {
    if (fieldsToBeUpdated.status) {
      if (fieldsToBeUpdated.status !== RecurrentTaskStatus.FINISHED) {
        if (fieldsToBeUpdated.status !== RecurrentTaskStatus.CANCELLED) {
          if (oldRecurrentTask.percentComplete && !fieldsToBeUpdated.percentComplete) {
            const error: any = new Error();
            error.statusCode = 400;
            error.message = 'You must also provide the \'percentComplete\' field!';
            throw error;
          }

          if (fieldsToBeUpdated.percentComplete === 100) {
            const error: any = new Error();
            error.statusCode = 400;
            error.message = 'Percent completed cannot be 100 when status is not finished.';
            throw error;
          }

          fieldsToBeUpdated.$unset = { finish: 1 };
        }
      } else {
        if (fieldsToBeUpdated.finish) {
          const error: any = new Error();
          error.statusCode = 400;
          error.message = 'You should only update the finish date, and the status will be automatically updated.';
          throw error;
        }

        fieldsToBeUpdated.finish = new Date();
        fieldsToBeUpdated.percentComplete = 100;
      }
    }

    return RecurrentTaskService.ensureRecurrentTaskValidity({ ...oldRecurrentTask, ...fieldsToBeUpdated });
  }
}

export default RecurrentTaskService;
