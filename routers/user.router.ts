// npm
import * as KoaRouter from 'koa-router';

// controllers
import { CreateUser, LoginUser } from '../controllers/user.controller';

// enums
import { ErrorCode } from '../enums';

/**
 * Sets up the routes for the api tasks.
 */
export class UserRouter extends KoaRouter {
  constructor() {
    super();

    this.post('/create', async (ctx) => {
      try {
        const payload = (ctx.request as any).body;
        const user = await CreateUser(payload);
        ctx.status = 200;
        ctx.body = user;
      } catch (err) {
        ctx.throw(400, err.message, { code: ErrorCode.InvalidArguments });
      }
    });

    this.post('/login', async (ctx) => {
      try {
        const payload = (ctx.request as any).body;
        const user = await LoginUser(payload);
        ctx.status = 200;
        ctx.body = user;
      } catch (err) {
        ctx.throw(400, err.message, { code: ErrorCode.InvalidArguments });
      }
    });
  }
}
