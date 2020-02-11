// npm
import * as _ from 'lodash';

// services
import * as chalk from 'chalk';
import { LogService as log } from '../services/log.service';

const env = process.env.NODE_ENV || 'default';

export const config = {
  env,
  web: {
    port: parseInt(process.env.PORT, 10) || 3040,
    jwt: {
      audience: process.env.JWT_ISSUER || 'https://taskly.io',
      issuer: process.env.JWT_ISSUER || 'taskly',
      secret: process.env.JWT_SECRET || 'taskly-secret',
      accessTokenExpiration: process.env.JWT_ACCESS_TOKEN_EXPIRATION || '+7d',
      refreshTokenExpiration: process.env.JWT_REFRESH_TOKEN_EXPIRATION || '+30d',
    },
  },

  db: {
    uri: process.env.DB_URI || 'mongodb://127.0.0.1:27017/taskly',
  },

  logs: {
    json: (process.env.JSON_LOGS === 'true') || false,
    level: process.env.LOGS_LEVEL || 'info',
    toFile: false,
    logsFileOutputDir: '',
  },
};

if (process.env.NODE_ENV && process.env.NODE_ENV !== 'default') {
  // eslint-disable-next-line global-require,import/no-dynamic-require
  const overridingConfig = require(`./${process.env.NODE_ENV}`).config;
  _.merge(config, overridingConfig);
}

const pkg = require('../package.json');

// Logging
log.init({ env, name: pkg.name, output: config.logs });
log.level = config.logs.level;
if (config.logs.toFile) {
  log.switchToFileTransport('./logs/', 'general.log');
}

// Chalk
let ctx = new chalk.Instance();
if (config.logs.json || config.logs.toFile) {
  ctx = new chalk.Instance({ level: 0 });
}

log.info(`Loaded configuration '${ctx.cyan(config.env)}'`);
