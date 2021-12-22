import { Connection, getRepository } from 'typeorm';
import * as sinon from 'sinon';
import * as supertest from 'supertest';
import UserEntity from '../../../../src/database/entity/User';
import runApp from '../../../../src/app';

describe('/v1/auth', () => {
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

    describe('POST /login', () => {
        let user: UserEntity;
        const params = {
            email: 'email@domain.com',
            password: 'password',
            name: 'name',
        }
        beforeEach(async () => {
            const userDataRepository = getRepository(UserEntity);
            const newUser = userDataRepository.create(params);
            user = await userDataRepository.save(newUser);
        });

        it('should respond with status 200', () =>
            request.post(`/v1/auth/login`)
                .send(params)
                .expect(200)
                .expect('Content-Type', /json/)
        );

        it('should respond with status 404 on wrong email input', () =>
            request.post(`/v1/auth/login`)
                .send({ email: 'wrongemail@domain.com', password: params.password }).expect(404));

        it('should respond with status 404 on wrong password input', () =>
            request.post(`/v1/auth/login`)
                .send({ email: params.email, password: 'random-password' }).expect(404));
    });
});
