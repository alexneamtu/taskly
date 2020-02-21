// npm
import * as assert from 'assert';

// app
import { config } from '../config';
import { TestLib } from './lib';

describe('user', () => {
  const lib = new TestLib(config);

  beforeAll(async () => {
    await lib.setup();
  });

  afterAll(async () => {
    await lib.tearDown();
  });

  it('should create and login user', async () => {
    const userData = {
      email: `test${TestLib.randomString()}@test.com`,
      password: 'Some-password',
      name: 'Test Test',
    };

    const created = await lib.user.create(userData);
    assert.ok(created);
    assert.ok(created.message, 'Please check your email for confirmation.');

    const credentials = await lib.user.login(userData.email, userData.password);
    assert.ok(credentials);
    assert.ok(credentials.accessToken);
    assert.ok(credentials.refreshToken);
  });

  it('shouldn\'t login with bad credentials', async () => {
    const userData = {
      email: `test${TestLib.randomString()}@test.com`,
      password: 'Some-password',
      name: 'Test Test',
    };

    const user = await lib.user.create(userData);
    assert.ok(user);

    await expect(lib.user.login(userData.email, 'xxx'))
      .rejects.toEqual(new Error('Error executing query: User/password mismatch.'));
  });
});
