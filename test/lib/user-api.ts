// app
import { BaseApi } from './base-api';

// types
import { ICreateUserInput, ICreateUserResponse, IUserCredentials } from '../../controllers/user.controller';

export class UserApi extends BaseApi {
  public async create(user: ICreateUserInput): Promise<ICreateUserResponse> {
    return this.doPost(['user'], user);
  }

  public async login(email: string, password: string): Promise<IUserCredentials> {
    return this.doPost(['user', 'login'], { email, password });
  }
}
