// npm
import * as bcrypt from 'bcrypt';
import * as jwt from 'jwt-simple';
import * as timestamp from 'unix-timestamp';

// models
import User, { IUser } from '../models/user.model';

// app
import { config } from '../config';

// services
import { LogService as log } from '../services/log.service';

export interface ICreateUserInput {
  email: IUser['email'];
  password: IUser['password'];
  name: IUser['name'];
}

export interface ICreateUserResponse {
  message: string;
}

export interface IUserCredentials {
  userId: string;
  user: IUser;
  accessToken: string;
  refreshToken: string;
}

export default class UserController {
  public static async CreateUser({ email, password, name }: ICreateUserInput):
    Promise<ICreateUserResponse> {
    const encodedPassword = UserController.encryptPassword(password);
    const user = await User.findOne({ email });
    if (user) {
      log.error(`User with the ${email} email already exists`);
    } else {
      await User.create({ email, password: encodedPassword, name }).then((data: IUser) => data);
    }
    return { message: 'Please check your email for confirmation.' };
  }

  public static async LoginUser({ email, password }: ICreateUserInput): Promise<IUserCredentials> {
    const user = await User.findOne({ email });

    if (user) {
      const match = bcrypt.compareSync(password, user.password);

      if (!match) throw new Error('User/password mismatch.');

      return this.createCredentials(user);
    }

    throw new Error('User/password mismatch.');
  }

  private static jwtConfig = config.web.jwt;

  private static createCredentials(user) {
    const accessTokenPayload = {
      userId: user.id,
      iss: UserController.jwtConfig.issuer,
      exp: timestamp.now(UserController.jwtConfig.accessTokenExpiration),
      aud: UserController.jwtConfig.audience,
    };

    const refreshTokenPayload = {
      userId: user.id,
      iss: UserController.jwtConfig.issuer,
      exp: timestamp.now(UserController.jwtConfig.refreshTokenExpiration),
      aud: UserController.jwtConfig.audience,
    };

    return {
      user,
      userId: user.id,
      accessToken: jwt.encode(accessTokenPayload, UserController.jwtConfig.secret),
      refreshToken: jwt.encode(refreshTokenPayload, UserController.jwtConfig.secret),
    };
  }

  private static encryptPassword(password: string) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }
}
