// npm
import * as assert from 'assert';
import * as moment from 'moment';

// app
import { config } from '../config';
import { TestLib } from './lib';
import { TaskApi } from './lib/task-api';

// models
import Task from '../models/task.model';

describe('task', () => {
  const lib = new TestLib(config);
  let authedTaskApi: TaskApi;

  beforeAll(async () => {
    await lib.setup();

    const userData = {
      email: `test${TestLib.randomString()}@test.com`,
      password: 'Some-password',
      name: 'Test Test',
    };

    const user = await lib.user.create(userData);
    assert.ok(user);

    const credentials = await lib.user.login(userData.email, userData.password);
    assert.ok(credentials);

    authedTaskApi = new TaskApi(lib.apiRequester, credentials.accessToken);
  });

  afterAll(async () => {
    await lib.tearDown();
  });


  it('should create task', async () => {
    const taskData = {
      title: 'Title',
      description: 'Description',
      deadline: moment().toDate(),
      reminder: moment().add(1, 'days').toDate(),
      completed: false,
    };

    const task = await authedTaskApi.create(taskData);
    assert.ok(task);
    assert.equal(task.title, taskData.title);
    assert.equal(task.description, taskData.description);
    assert.equal(task.deadline, taskData.deadline.toISOString());
    assert.equal(task.reminder, taskData.reminder.toISOString());
    assert.equal(task.completed, taskData.completed);
  });

  it('shouldn\'t create task when not authorized', async () => {
    const taskData = {
      title: 'Title',
      description: 'Description',
      deadline: moment().toDate(),
      reminder: moment().add(1, 'days').toDate(),
      completed: false,
    };

    try {
      const task = await lib.task.create(taskData);
      assert.ok(task);
    } catch (e) {
      assert.equal(e.message, 'Error executing query: Invalid authorization header.');
    }
  });


  it('should return task', async () => {
    const taskData = {
      title: 'Title',
      description: 'Description',
      deadline: moment().toDate(),
      reminder: moment().add(1, 'days').toDate(),
      completed: false,
    };

    const createdTask = await authedTaskApi.create(taskData);
    assert.ok(createdTask);

    const task = await authedTaskApi.detail(createdTask._id);
    assert.ok(task);
    assert.equal(task._id, createdTask._id);
    assert.equal(task.title, taskData.title);
    assert.equal(task.description, taskData.description);
    assert.equal(task.deadline, taskData.deadline.toISOString());
    assert.equal(task.reminder, taskData.reminder.toISOString());
    assert.equal(task.completed, taskData.completed);
  });

  it('should list tasks', async () => {
    await Task.deleteMany({});
    const taskData = {
      title: 'Title',
      description: 'Description',
      deadline: moment().toDate(),
      reminder: moment().add(1, 'days').toDate(),
      completed: true,
    };

    const createdTask1 = await authedTaskApi.create(taskData);
    assert.ok(createdTask1);

    const createdTask2 = await authedTaskApi.create(taskData);
    assert.ok(createdTask2);

    const tasks = await authedTaskApi.list({ limit: 1, skip: 1 });
    assert.ok(tasks);
    assert.equal(tasks.totalCount, 2);
    assert.equal(tasks.result.length, 1);
    assert.equal(tasks.result[0].data._id, createdTask2._id);
    assert.equal(tasks.result[0].data.title, createdTask2.title);
    assert.equal(tasks.result[0].data.description, createdTask2.description);
    assert.equal(tasks.result[0].data.deadline, createdTask2.deadline);
    assert.equal(tasks.result[0].data.reminder, createdTask2.reminder);
    assert.equal(tasks.result[0].data.completed, createdTask2.completed);
    assert.equal(tasks.result[0].cursor, 1);
    assert.equal(tasks.pageInfo.count, 1);
    assert.equal(tasks.pageInfo.hasNextPage, false);
    assert.equal(tasks.pageInfo.lastCursor, 1);
  });

  it('should update task', async () => {
    const taskData = {
      title: 'Title',
      description: 'Description',
      deadline: moment().toDate(),
      reminder: moment().add(1, 'days').toDate(),
      completed: true,
    };

    const createdTask = await authedTaskApi.create(taskData);
    assert.ok(createdTask);


    const updatedTaskData = { title: 'Title-Updated', completed: false };
    const task = await authedTaskApi.update(createdTask._id, updatedTaskData);
    assert.ok(task);
    assert.equal(task._id, createdTask._id);
    assert.equal(task.title, updatedTaskData.title);
    assert.equal(task.description, taskData.description);
    assert.equal(task.deadline, taskData.deadline.toISOString());
    assert.equal(task.reminder, taskData.reminder.toISOString());
    assert.equal(task.completed, updatedTaskData.completed);
  });

  it('should delete task', async () => {
    const taskData = {
      title: 'Title',
      description: 'Description',
      deadline: moment().toDate(),
      reminder: moment().add(1, 'days').toDate(),
      completed: true,
    };

    const createdTask = await authedTaskApi.create(taskData);
    assert.ok(createdTask);


    const task = await authedTaskApi.delete(createdTask._id);
    assert.ok(task);
  });
});
