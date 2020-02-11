// npm
import * as supertest from 'supertest';

// services
import { WebService } from '../../services';

// routers
import { TaskRouter, UserRouter } from '../../routers';

// test
import { TaskApi } from './task-api';
import { UserApi } from './user-api';
import { DbService } from '../../services/db.service';


export class TestLib {
  public apiRequester;

  public config;

  public db: DbService;

  public task: TaskApi;
  public user: UserApi;

  constructor(configOpts) {
    this.config = configOpts;

    this.db = new DbService(configOpts.db);

    const web = new WebService(
      { web: this.config.web },
      [new TaskRouter(), new UserRouter()],
    );

    this.apiRequester = supertest.agent(web.app.callback());

    this.task = new TaskApi(this.apiRequester, '');
    this.user = new UserApi(this.apiRequester, '');
  }

  public async setup() {
    await this.db.initialize();
    await this.db.drop();
  }

  public async tearDown() {
    await this.db.close();
  }
}
