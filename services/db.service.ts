// npm
import * as mongoose from 'mongoose';

// services
import { LogService as log } from './log.service';

export interface IDbConfig {
  uri: string;
}

export class DbService {
  // eslint-disable-next-line no-useless-constructor,no-empty-function
  constructor(private config: IDbConfig) {}

  public async initialize() {
    try {
      await mongoose.connect(
        this.config.uri,
        { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true },
      );
    } catch (err) {
      log.error(`Unable to connect to '${this.config.uri}': ${err}`);

      throw err;
    }

    log.info(`Connected to '${this.config.uri}'.`);
  }

  // eslint-disable-next-line class-methods-use-this
  public async drop() {
    await mongoose.connection.db.dropDatabase();
  }

  // eslint-disable-next-line class-methods-use-this
  public async close() {
    await mongoose.connection.close();
  }
}
