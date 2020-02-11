// npm
import 'jest';
import * as path from 'path';

// app
import { config } from './config';

// services
import { LogService as log } from './services/log.service';

if (config.logs.toFile) {
  const _describe = (global as any).describe;
  const _it = (global as any).it;

  let currentDesc;

  (global as any).describe = (description, specDefinitions) => {
    currentDesc = description;

    _describe(description, specDefinitions);
  };

  (global as any).it = (description, test, timeout) => {
    const wrappedTest = () => {
      log.switchToFileTransport(path.join('./logs', currentDesc), `${description}.log`);

      return test();
    };

    return _it(description, wrappedTest, timeout);
  };
}

// jest.setTimeout(10000);
