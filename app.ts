// services
import { WebService } from './services';

// routers
import { TaskRouter } from './routers';

// config
import { config } from './config';

const taskRouter = new TaskRouter();

const webServer = new WebService({ web: config.web }, [taskRouter]);

(async () => {
    await webServer.listen();
})();
