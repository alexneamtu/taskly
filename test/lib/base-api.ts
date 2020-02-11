// npm
import { SuperTest, Test } from 'supertest';


export interface IListOptions {
  limit?: number;
  skip?: number;
}

/**
 * Provides primitive methods for executing requests against a rest API.
 */
export class BaseApi {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    private requester: SuperTest<Test>,
    private token: string,
    // eslint-disable-next-line no-empty-function
  ) {
  }

  public async doGet(pathArgs: string[], queryArgs?: IListOptions) {
    const path = `/${pathArgs.join('/')}`;
    let query: string;
    if (queryArgs) {
      query = Object
        .keys(queryArgs)
        .map((key) => `${key}=${encodeURI(queryArgs[key])}`).join('&');
    }

    const response = await this.requester
      .get(`${path}${query ? `?${query}` : ''}`)
      .set('Authorization', `Bearer ${this.token}`);
    return response.body;
  }

  public async doPost(pathArgs: string[], payload: any): Promise<any> {
    const response = await this.requester
      .post(`/${pathArgs.join('/')}`)
      .send(payload)
      .set('Authorization', `Bearer ${this.token}`);
    if (response.error || response.body.error) {
      throw new Error(`Error executing query: ${response.body.errors[0].message}`);
    }
    return response.body;
  }

  public async doPatch(pathArgs: string[], payload: any): Promise<any> {
    const response = await this.requester
      .patch(`/${pathArgs.join('/')}`)
      .send(payload)
      .set('Authorization', `Bearer ${this.token}`);
    return response.body;
  }

  public async doDelete(pathArgs: string[]): Promise<any> {
    const response = await this.requester
      .delete(`/${pathArgs.join('/')}`)
      .set('Authorization', `Bearer ${this.token}`);
    return response.body;
  }
}
