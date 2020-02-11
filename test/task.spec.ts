// npm
import * as assert from 'assert';
import * as moment from 'moment';

// app
import { config } from '../config';
import { TestLib } from './lib';
import { TaskApi } from './lib/task-api';

describe('task', () => {
  const lib = new TestLib(config);
  let authedTaskApi: TaskApi;

  beforeAll(async () => {
    await lib.setup();

    const userData = {
      email: 'test@test.com',
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


  it('should be created', async () => {
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

  // it('should be returned', async () => {
  //   const task = await authedTaskApi.create('1');
  //   assert.ok(task);
  // });
});
