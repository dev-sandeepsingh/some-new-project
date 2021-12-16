import * as assert from 'assert';
import { Connection, getRepository } from 'typeorm';
import * as sinon from 'sinon';
import * as supertest from 'supertest';
import UserDataEntity from '../../../../src/database/entity/UserData';
import runApp from '../../../../src/app';

describe('/v1/userData', () => {
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
    await dbConnection
      .createQueryBuilder()
      .delete()
      .from(UserDataEntity)
      .execute();
    sandbox.restore();
  });

  describe('PUT /:id', () => {
    let userData: UserDataEntity;

    beforeEach(async () => {
      userData = await getRepository(UserDataEntity).save({
        email: 'sandeep@domain.com',
        name: 'Sandeep',
      });
    });
    context('item with given ID exists', () => {
      let itemId: number;
      let dataToUpdate;

      beforeEach(() => {
        itemId = userData.id;

        dataToUpdate = {
          name: 'Name3',
        };
      });

      it('should respond with status 200', () =>
        request.put(`/v1/users/${itemId}`).send(dataToUpdate).expect(200));

      it("should respond with item's data", () =>
        request
          .put(`/v1/users/${itemId}`)
          .send(dataToUpdate)
          .expect(200)
          .then((response) => {
            const responseJSON = response.body;
            const result = responseJSON.data;
            const originalUpdatedAt = userData.updatedAt.getTime();

            assert(result);

            const expected = {
              id: userData.id,
              name: dataToUpdate.name,
              email: userData.email,
            };

            assert.notStrictEqual(result.updatedAt, originalUpdatedAt);

            delete result.updatedAt;
            delete result.createdAt;
            delete result.deletedAt;

            assert.deepStrictEqual(result, expected);
          }));

      it('should update data in DB', () =>
        request
          .put(`/v1/users/${itemId}`)
          .send(dataToUpdate)
          .expect(200)
          .then(async () => {
            const updatedData = await getRepository(UserDataEntity).findOne(
              itemId,
            );

            assert(updatedData);
            assert.strictEqual(updatedData.name, dataToUpdate.name);
          }));
    });

    context("item with given ID doesn't exists", () => {
      let itemId: number;

      beforeEach(() => {
        itemId = userData.id + 100;
      });

      it('should respond with status 404', () =>
        request
          .put(`/v1/users/${itemId}`)
          .send({
            firstName: 'Name3',
          })
          .expect(404));
    });
  });
});
