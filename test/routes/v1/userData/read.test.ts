import * as assert from 'assert';
import * as sinon from 'sinon';
import * as supertest from 'supertest';
import { Connection, getRepository } from 'typeorm';
import UserDataEntity from '../../../../src/database/entity/UserData';
import runApp from '../../../../src/app';

describe('/v1/userData', () => {
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
    await dbConnection
      .createQueryBuilder()
      .delete()
      .from(UserDataEntity)
      .execute();

    sandbox.restore();
  });

  describe('GET /:id', () => {
    let userData: UserDataEntity;

    beforeEach(async () => {
      const userDataRepository = getRepository(UserDataEntity);

      userData = await userDataRepository.save({
        email: 'sandeep@domain.com',
        name: 'Sandeep',
      });
    });

    describe('client sends valid ID of his data', () => {
      describe('Ger user data by id', () => {
        it('should respond with status 200 and data', () =>
          request
            .get(`/v1/users/${userData.id}`)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(async (response) => {
              assert.strictEqual(response.body.data.id, String(userData.id));
              assert.strictEqual(response.body.data.email, userData.email);
              assert.strictEqual(response.body.data.name, userData.name);
            }));
      });
    });
  });
});
