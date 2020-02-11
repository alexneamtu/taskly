// models
import Task, { ITask } from '../models/task.model';

interface ICreateTaskInput {
  title: ITask['title'];
  description: ITask['description'];
  deadline: ITask['deadline'];
  reminder: ITask['reminder'];
  completed: ITask['completed'];
}

export async function CreateTask(taskInput: ICreateTaskInput): Promise<ITask> {
  return Task.create(taskInput).then((data: ITask) => data);
}

export async function GetTask(id: string): Promise<ITask> {
  return Task.findOne({ id }).then((data: ITask) => data);
}

export async function ListTasks(): Promise<ITask[]> {
  return Task.find().then((data: ITask[]) => data);
}

export async function DeleteTask(id: string): Promise<boolean> {
  return Task.deleteOne({ id }).then((result) => !!result.ok);
}
