// npm
import { SuperTest, Test } from 'supertest';


/**
 * Provides primitive methods for executing requests against a GraphQL API.
 */
export class BaseApi {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    private requester: SuperTest<Test>,
    private token: string,
    // eslint-disable-next-line no-empty-function
  ) {}

  public async doGet(path: string, id: string) {
    return this.requester
      .get(`/${path}/${id}`)
      .set('Authorization', `Bearer ${this.token}`);
  }

  public async doPost(path: string, payload: any): Promise<any> {
    const response = await this.requester
      .post(`/${path}`)
      .send(payload)
      .set('Authorization', `Bearer ${this.token}`);
    return response.body;
  }
}
