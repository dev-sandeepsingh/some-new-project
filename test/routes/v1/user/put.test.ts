import * as assert from 'assert';
import { Connection, getRepository } from 'typeorm';
import * as sinon from 'sinon';
import * as supertest from 'supertest';
import UserEntity from '../../../../src/database/entity/User';
import runApp from '../../../../src/app';
import { Role } from '../../../../src/types';
import jwtSign from '../../../../src/utils/jwtSign';

describe('/v1/users', () => {
  let dbConnection: Connection;
  let request: supertest.SuperTest<supertest.Test>;
  let appCleanup: () => Promise<void>;
  let sandbox: sinon.SinonSandbox;

  before('prepare app', async () => {
    const { app, cleanup, connection } = await runApp();

    dbConnection = connection;
    request = supertest(app);
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

  describe('PUT /:id', () => {
    let user: UserEntity;
    let token: string;

    beforeEach(async () => {
      user = await getRepository(UserEntity).save({
        email: 'sandeep@domain.com',
        password: 'test',
      });
      token = jwtSign(user);
    });
    context('item with given ID exists', () => {
      let itemId: number;
      let dataToUpdate;

      beforeEach(() => {
        itemId = user.id;

        dataToUpdate = {
          name: 'Name3',
        };
      });

      it('should respond with status 200', () =>
        request
          .put(`/v1/users/${itemId}`)
          .set('Authorization', `Bearer ${token}`)
          .send(dataToUpdate)
          .expect(200));

      it("should respond with item's data", () =>
        request
          .put(`/v1/users/${itemId}`)
          .set('Authorization', `Bearer ${token}`)
          .send(dataToUpdate)
          .expect(200)
          .then((response) => {
            const responseJSON = response.body;
            const result = responseJSON.data;
            const originalUpdatedAt = user.updatedAt.getTime();

            assert(result);

            const expected = {
              id: user.id,
              name: dataToUpdate.name,
              email: user.email,
              role: Role.USER,
            };

            assert.notStrictEqual(result.updatedAt, originalUpdatedAt);

            delete result.updatedAt;
            delete result.createdAt;
            delete result.deletedAt;
            delete result.password;

            assert.deepStrictEqual(result, expected);
          }));

      it('should update data in DB', () =>
        request
          .put(`/v1/users/${itemId}`)
          .send(dataToUpdate)
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
          .then(async () => {
            const updatedData = await getRepository(UserEntity).findOne(itemId);

            assert(updatedData);
            assert.strictEqual(updatedData.name, dataToUpdate.name);
          }));
    });

    context("item with given ID doesn't exists", () => {
      let itemId: number;

      beforeEach(() => {
        itemId = user.id + 100;
      });

      it('should respond with status 404', () =>
        request
          .put(`/v1/users/${itemId}`)
          .set('Authorization', `Bearer ${token}`)
          .send({
            firstName: 'Name3',
          })
          .expect(404));
    });
  });
});
