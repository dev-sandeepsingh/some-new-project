import 'reflect-metadata';
import { createConnection } from 'typeorm';
import fastify, { FastifyInstance } from 'fastify';
import * as path from 'path';
import logger from './service/logger';
import { init as initRedis, close as closeRedis } from './service/redis';
import errorMiddleware from './routes/middleware/errorMiddleware';
import RoutesRoot from './routes/root';
import RoutesV1 from './routes/v1';
import catchAsync from './utils/catchAsync';
import swaggerConfig from './swagger';

interface RunAppResult {
  app: FastifyInstance;
}

const runApp: () => Promise<RunAppResult> = catchAsync(
  async () => {
    logger('info', 'Setting up connections');    
    const connection = await createConnection();    
    // const [connection] = await Promise.all([
    //   createConnection(),
    //   initRedis(),
    // ]);

    logger('info', 'All connections established, loading Fastify app');

    const app = fastify();

    app.setErrorHandler(errorMiddleware);
    // app.addContentTypeParser('*', (request, payload, done) => {
    //   done(null, null);
    // });

    // app.register(helmet);
    // app.register(compress);
    // app.register(swagger, swaggerConfig);

    // app.register(fastifyStatic, {
    //   root: path.join(process.cwd(), 'public'),
    //   prefix: '/public/',
    // });

    app.register(RoutesRoot);
    app.register(RoutesV1, { prefix: '/v1' });

    await app.ready();

    if (app.swagger) {
      app.swagger();
    }

    logger('info', 'Fastify application is loaded');

    await connection.close();
    // const cleanup = async () => {
    //   closeRedis();
    //   await connection.close();
    // };

    return { app };
  },
  (error: Error) => {
    logger('critical', `TypeORM connection error: ${error.message}`);

    throw error;
  },
);

export default runApp;
