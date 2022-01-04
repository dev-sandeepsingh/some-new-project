import * as assert from 'assert';
import * as sinon from 'sinon';
import * as supertest from 'supertest';
import { Connection, getRepository } from 'typeorm';
import UserEntity from '../../../../src/database/entity/User';
import runApp from '../../../../src/app';
import jwtSign from '../../../../src/utils/jwtSign';

describe('/v1/users', () => {
  let request: supertest.SuperTest<supertest.Test>;
  let dbConnection: Connection;
  let sandbox: sinon.SinonSandbox;
  let appCleanup: () => Promise<void>;

  before('prepare app', async () => {
    const { app, cleanup, connection } = await runApp();

    request = supertest(app);
    dbConnection = connection;
    appCleanup = cleanup;
  });

  after('close connection', async () => {
    await appCleanup();
  });

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
  });

  afterEach(async () => {
    await dbConnection.createQueryBuilder().delete().from(UserEntity).execute();

    sandbox.restore();
  });

  describe('GET /:id', () => {
    let user: UserEntity;
    let token: string;

    beforeEach(async () => {
      const userRepository = getRepository(UserEntity);

      user = await userRepository.save({
        email: 'john@domain.com',
        password: 'Test',
        name: 'John',
      });
      token = jwtSign(user);
    });

    describe('client sends valid ID of his data', () => {
      describe('Ger user data by id', () => {
        it('should respond with status 200 and data', () =>
          request
            .get(`/v1/users/${user.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(async (response) => {
              assert.strictEqual(response.body.data.id, String(user.id));
              assert.strictEqual(response.body.data.email, user.email);
              assert.strictEqual(response.body.data.name, user.name);
            }));
      });
    });
  });
});
