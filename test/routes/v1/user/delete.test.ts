import * as assert from 'assert';
import { Connection, getRepository } from 'typeorm';
import * as sinon from 'sinon';
import * as supertest from 'supertest';
import UserEntity from '../../../../src/database/entity/User';
import runApp from '../../../../src/app';

describe('/v1/userData', () => {
  let dbConnection: Connection;
  let request: supertest.SuperTest<supertest.Test>;
  let appCleanup: () => Promise<void>;
  let sandbox: sinon.SinonSandbox;

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
      .from(UserEntity)
      .execute();
    sandbox.restore();
  });

  describe('DELETE /:id', () => {
    let itemId: number;
    let user: UserEntity;

    beforeEach(async () => {
      const userDataRepository = getRepository(UserEntity);

      user = await userDataRepository.save({
        email: 'sandeep@domain.com',
        password: 'password',
        name: 'Sandeep',
      });

      itemId = user.id;
    });

    it('should respond with status 200', () =>
      request.delete(`/v1/users/${itemId}`).expect(200));
    it('should delete item with given ID from database', () =>
      request
        .delete(`/v1/users/${itemId}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .then(async () => {
          const record = await getRepository(UserEntity).findOne(itemId);
          assert(!record);
        }));

    it('should respond with status 404', () =>
      request.delete(`/v1/users/${Number(itemId) + 1}`).expect(404));
  });
});
