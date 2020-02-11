// npm
import * as bcrypt from 'bcrypt';
import * as jwt from 'jwt-simple';
import * as timestamp from 'unix-timestamp';

// models
import User, { IUser } from '../models/user.model';

// app
import { config } from '../config';

interface ICreateUserInput {
  email: IUser['email'];
  password: IUser['password'];
  name: IUser['name'];
}

export interface IUserCredentials {
  userId: string;
  user: IUser;
  accessToken: string;
  refreshToken: string;
}

export default class UserController {
  public static async CreateUser({ email, password, name }: ICreateUserInput): Promise<IUser> {
    const encodedPassword = UserController.encryptPassword(password);
    return User.create({ email, password: encodedPassword, name }).then((data: IUser) => data);
  }

  public static async LoginUser({ email, password }: ICreateUserInput): Promise<IUserCredentials> {
    const user = await User.findOne({ email }).then((data: IUser) => data);

    const match = bcrypt.compareSync(password, user.password);

    if (!match) return null;

    return this.createCredentials(user);
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
