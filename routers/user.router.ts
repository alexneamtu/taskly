// npm
import * as KoaRouter from 'koa-router';

// controllers
import UserController from '../controllers/user.controller';

// enums
import { ErrorCode } from '../enums';

/**
 * Sets up the routes for the api tasks.
 */
export class UserRouter extends KoaRouter {
  constructor() {
    super();

    this.post('/', async (ctx) => {
      try {
        const payload = (ctx.request as any).body;
        const user = await UserController.CreateUser(payload);
        ctx.status = 200;
        ctx.body = user;
      } catch (err) {
        ctx.throw(400, err.message, { code: ErrorCode.InvalidArguments });
      }
    });

    this.post('/login', async (ctx) => {
      try {
        const payload = (ctx.request as any).body;
        const user = await UserController.LoginUser(payload);
        ctx.status = 200;
        ctx.body = user;
      } catch (err) {
        ctx.throw(400, err.message, { code: ErrorCode.InvalidArguments });
      }
    });
  }
}
