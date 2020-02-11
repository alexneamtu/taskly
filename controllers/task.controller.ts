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
  public static async CreateTask(taskInput: ICreateTaskInput): Promise<ITask> {
    return Task.create(taskInput).then((data: ITask) => data);
  }

  public static async GetTask(id: string): Promise<ITask> {
    return Task.findById(id).then((data: ITask) => data);
  }

  public static async ListTasks({ limit = 0, skip = 50 }: IListOptions): Promise<IListResult> {
    const totalCount = await Task.find().countDocuments();

    const tasks = await Task
      .find()
      .sort({ _id: 1 })
      .skip(+(skip > 50 ? 50 : skip))
      .limit(+limit)
      .then((data: ITask[]) => data);

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

  public static async UpdateTask(id: string, taskInput: IUpdateTaskInput): Promise<ITask> {
    const task = await Task.findById(id).then((data: ITask) => data);
    Object.assign(task, taskInput);
    await task.save();
    return task;
  }

  public static async DeleteTask(id: string): Promise<boolean> {
    return Task.deleteOne({ id }).then((result) => !!result.ok);
  }
}
