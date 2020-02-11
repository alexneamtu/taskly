// npm
import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as mount from 'koa-mount';
import * as KoaRouter from 'koa-router';
import * as validate from 'koa-validate';
import * as _ from 'lodash';

// services
import { LogService as log } from './log.service';

export interface IWebServerConfig {
    web: {
        port: number;
    };
}

export class WebService {
    public readonly app: Koa;

    public server;

    constructor(private config: IWebServerConfig, routers: KoaRouter[]) {
        const app = new Koa();

        app.use(bodyParser({ extendTypes: { json: ['text/plain'] } }));

        validate(app);

        // Mount all routers
        routers.forEach((router) => {
            const service = new Koa();
            service.use(router.routes());
            service.use(router.allowedMethods());

            app.use(mount(`/${_.replace(router.constructor.name.toLowerCase(), 'router', '')}`, service));
        });

        this.app = app;
    }

    public async listen() {
        this.server = this.app.listen(this.config.web.port, () => {
            log.info(`Listening on port ${this.config.web.port}...`);
        });
    }
}
