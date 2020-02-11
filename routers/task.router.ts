// npm
import * as KoaRouter from 'koa-router';

/**
 * Adds a metrics endpoint and exposes a method to log all application requests
 */
export class TaskRouter extends KoaRouter {
    constructor() {
        super();

        // add metrics endpoint
        this.get('/', (ctx) => {
            ctx.status = 200;
            ctx.body = '';
        });
    }
}
