import LogModel from '@models/Log';

class LogService {
  public static async getLogsWithinTimeRange(start, end, { resourceType, executerId, operation }): Promise<any> {
    const $and = [];

    if (start) $and.push({ timestamp: { $gte: new Date(start) } });

    if (end) $and.push({ timestamp: { $lt: new Date(end) } });

    if (resourceType) $and.push({ resourceType });

    if (executerId) $and.push({ 'executer.id': executerId });

    if (operation) $and.push({ operation });

    const mongoQuery: any = {};

    if ($and.length) mongoQuery.$and = $and;

    const logs = await LogModel
      .find(mongoQuery)
      .sort({ timestamp: 1 })
      .lean();

    return logs;
  }
}

export default LogService;
