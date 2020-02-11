// app
import { BaseApi } from './base-api';

// models
import { ITask } from '../../models/task.model';

/**
 * Exposes the consumer api functionality.
 */
export class TaskApi extends BaseApi {
  public async create(task): Promise<ITask> {
    return this.doPost('task/create', task);
  }

  public async get(id: string) {
    return this.doGet('task', id);
  }
}
