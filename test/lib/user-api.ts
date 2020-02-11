// app
import { BaseApi } from './base-api';

// types
import { IUser } from '../../models/user.model';
import { IUserCredentials } from '../../controllers/user.controller';

export class UserApi extends BaseApi {
  public async create(user): Promise<IUser> {
    return this.doPost(['user'], user);
  }

  public async login(email, password): Promise<IUserCredentials> {
    return this.doPost(['user', 'login'], { email, password });
  }
}
