// services
import { DbService } from './services/db.service';
import { WebService } from './services';

// routers
import { TaskRouter, UserRouter } from './routers';

// config
import { config } from './config';


const userRouter = new UserRouter();
const taskRouter = new TaskRouter();

const dbService = new DbService(config.db);
const webServer = new WebService({ web: config.web }, [taskRouter, userRouter]);

(async () => {
  await dbService.initialize();
  await webServer.listen();
})();
