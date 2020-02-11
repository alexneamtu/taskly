// npm
import * as bcrypt from 'bcrypt';
import * as jwt from 'jwt-simple';
import * as timestamp from 'unix-timestamp';

// models
import User, { IUser } from '../models/user.model';

// app
import { config } from '../config';

const jwtConfig = config.web.jwt;

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

function encryptPassword(password: string) {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

export async function CreateUser({ email, password, name }: ICreateUserInput): Promise<IUser> {
  const encodedPassword = encryptPassword(password);
  return User.create({ email, password: encodedPassword, name }).then((data: IUser) => data);
}

export async function LoginUser({ email, password }: ICreateUserInput): Promise<IUserCredentials> {
  const user = await User.findOne({ email }).then((data: IUser) => data);

  const match = bcrypt.compareSync(password, user.password);

  if (!match) return null;

  const accessTokenPayload = {
    userId: user._id,
    iss: jwtConfig.issuer,
    exp: timestamp.now(jwtConfig.accessTokenExpiration),
    aud: jwtConfig.audience,
  };

  const refreshTokenPayload = {
    userId: user._id,
    iss: jwtConfig.issuer,
    exp: timestamp.now(jwtConfig.refreshTokenExpiration),
    aud: jwtConfig.audience,
  };

  return {
    user,
    userId: user._id,
    accessToken: jwt.encode(accessTokenPayload, jwtConfig.secret),
    refreshToken: jwt.encode(refreshTokenPayload, jwtConfig.secret),
  };
}
