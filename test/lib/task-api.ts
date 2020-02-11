// app
import { BaseApi, IListOptions } from './base-api';

// models
import { ITask } from '../../models/task.model';

// types
import { IListResult } from '../../controllers/task.controller';

/**
 * Exposes the consumer api functionality.
 */
export class TaskApi extends BaseApi {
  public async create(task): Promise<ITask> {
    return this.doPost(['task'], task);
  }

  public async detail(id: string): Promise<ITask> {
    return this.doGet(['task', id]);
  }

  public async list(options?: IListOptions): Promise<IListResult> {
    return this.doGet(['task'], options);
  }

  public async update(id: string, data): Promise<ITask> {
    return this.doPatch(['task', id], data);
  }

  public async delete(id: string): Promise<boolean> {
    return this.doDelete(['task', id]);
  }
}
