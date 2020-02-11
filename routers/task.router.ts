// npm
import * as jwt from 'jsonwebtoken';
import * as KoaRouter from 'koa-router';
import { Context } from 'koa';

// enums
import { ErrorCode } from '../enums';

// app
import { config } from '../config';

// controllers
import TaskController from '../controllers/task.controller';

const jwtConfig = config.web.jwt;

/**
 * Sets up the routes for the api tasks.
 */
export class TaskRouter extends KoaRouter {
  constructor() {
    super();

    this.use(TaskRouter.checkAuthorization);

    this.post('/', async (ctx) => {
      try {
        const payload = (ctx.request as any).body;
        const task = await TaskController.CreateTask(payload);
        ctx.status = 201;
        ctx.body = task;
      } catch (err) {
        ctx.throw(400, err.message, { code: ErrorCode.InvalidArguments });
      }
    });

    this.get('/', async (ctx) => {
      try {
        const result = await TaskController.ListTasks(ctx.query);
        ctx.status = 200;
        ctx.body = result;
      } catch (err) {
        ctx.throw(400, err.message, { code: ErrorCode.InvalidArguments });
      }
    });

    this.get('/:id', async (ctx) => {
      try {
        const task = await TaskController.GetTask(ctx.params.id);
        ctx.status = 200;
        ctx.body = task;
      } catch (err) {
        ctx.throw(400, err.message, { code: ErrorCode.InvalidArguments });
      }
    });

    this.patch('/:id', async (ctx) => {
      try {
        const payload = (ctx.request as any).body;
        const task = await TaskController.UpdateTask(ctx.params.id, payload);
        ctx.status = 200;
        ctx.body = task;
      } catch (err) {
        ctx.throw(400, err.message, { code: ErrorCode.InvalidArguments });
      }
    });

    this.delete('/:id', async (ctx) => {
      try {
        const task = await TaskController.DeleteTask(ctx.params.id);
        ctx.status = 200;
        ctx.body = task;
      } catch (err) {
        ctx.throw(400, err.message, { code: ErrorCode.InvalidArguments });
      }
    });
  }

  /**
   * Verifies that the request contains a valid authentication token.
   *
   * @param {Application.Context} ctx
   * @param next
   *
   * @returns Promise<void>
   */
  private static async checkAuthorization(ctx: Context, next): Promise<void> {
    const authorizationHdr = ctx.get('authorization');
    const [scheme, token] = authorizationHdr.split(' ');
    if (scheme !== 'Bearer' || !token) ctx.throw(401, 'Invalid authorization header.', { code: ErrorCode.InvalidAuthorization });
    try {
      const decoded: any = jwt.verify(token, jwtConfig.secret, {
        audience: jwtConfig.audience,
        issuer: jwtConfig.issuer,
      });
      ctx.state.userId = decoded.userId;
    } catch (err) {
      ctx.throw(401, 'Invalid authorization header.', { code: ErrorCode.InvalidAuthorization });
    }

    await next();
  }
}
