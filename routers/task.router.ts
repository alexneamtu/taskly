// npm
import * as jwt from 'jsonwebtoken';
import * as KoaRouter from 'koa-router';
import { Context } from 'koa';

// enums
import { ErrorCode } from '../enums';

// app
import { config } from '../config';

// controllers
import { CreateTask } from '../controllers/task.controller';

const jwtConfig = config.web.jwt;

/**
 * Sets up the routes for the api tasks.
 */
export class TaskRouter extends KoaRouter {
  constructor() {
    super();

    this.use(TaskRouter.checkAuthorization);

    this.post('/create', async (ctx) => {
      try {
        const payload = (ctx.request as any).body;
        const task = await CreateTask(payload);
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
