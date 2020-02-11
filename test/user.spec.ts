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

  it('should be created', async () => {
    const userData = {
      email: 'test@test.com',
      password: 'Some-password',
      name: 'Test Test',
    };

    const user = await lib.user.create(userData);
    assert.ok(user);
    assert.equal(user.email, userData.email);
    assert.equal(user.name, userData.name);
  });

  it('should login after creation', async () => {
    const userData = {
      email: 'test1@test.com',
      password: 'Some-password',
      name: 'Test Test',
    };

    const user = await lib.user.create(userData);
    assert.ok(user);

    const credentials = await lib.user.login(userData.email, userData.password);
    assert.ok(credentials);
    assert.equal(credentials.userId, user._id);
    assert.ok(credentials.accessToken);
    assert.ok(credentials.refreshToken);
  });
});
