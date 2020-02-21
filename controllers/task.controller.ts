// npm
import * as _ from 'lodash';
import { RouterContext } from 'koa-router';

// models
import Task, { ITask } from '../models/task.model';
import { IListOptions } from '../test/lib/base-api';

interface ICreateTaskInput {
  title: ITask['title'];
  description: ITask['description'];
  deadline: ITask['deadline'];
  reminder: ITask['reminder'];
  completed: ITask['completed'];
}

interface IUpdateTaskInput {
  title?: ITask['title'];
  description?: ITask['description'];
  deadline?: ITask['deadline'];
  reminder?: ITask['reminder'];
  completed?: ITask['completed'];
}


export interface IListResult {
  totalCount: number;
  result: {
    data: any;
    cursor: number;
  }[];
  pageInfo: IPageInfo;
}

export interface IPageInfo {
  count: number;
  lastCursor: number;
  hasNextPage: boolean;
}

export default class TaskController {
  public static async CreateTask(ctx: RouterContext, taskInput: ICreateTaskInput): Promise<ITask> {
    _.merge(taskInput, { createdBy: ctx.state.userId });
    return Task.create(taskInput);
  }

  public static async GetTask(ctx: RouterContext): Promise<ITask> {
    const id = _.get(ctx, 'params.id');
    return Task.findById(id);
  }

  public static async ListTasks(ctx: RouterContext): Promise<IListResult> {
    const userId = _.get(ctx, 'state.userId');
    const { limit = 0, skip = 50 }: IListOptions = ctx.query;

    const totalCount = await Task.find().countDocuments();

    const tasks = await Task
      .find({ createdBy: userId })
      .sort({ _id: 1 })
      .skip(+(skip > 50 ? 50 : skip))
      .limit(+limit);

    const result = tasks.map((data, index) => ({
      data,
      cursor: +skip + index,
    }));

    return {
      totalCount,
      result,
      pageInfo: {
        count: result.length,
        lastCursor: result.length ? result[result.length - 1].cursor : undefined,
        hasNextPage: (+skip + result.length < totalCount),
      },
    };
  }

  public static async UpdateTask(ctx: RouterContext, taskInput: IUpdateTaskInput): Promise<ITask> {
    const id = _.get(ctx, 'params.id');
    const userId = _.get(ctx, 'state.userId');

    const task = await Task.findById(id);

    if (task.createdBy !== userId) {
      throw new Error('Not authorized');
    }

    Object.assign(task, taskInput);
    await task.save();
    return task;
  }

  public static async DeleteTask(ctx: RouterContext): Promise<boolean> {
    const id = _.get(ctx, 'params.id');
    const userId = _.get(ctx, 'state.userId');
    const task = await Task.findById({ id });
    if (task.createdBy !== userId) {
      throw new Error('Not authorized');
    }
    const result = await Task.deleteOne({ id });
    return !!result.ok;
  }
}
