// import 'reflect-metadata';
import { createConnection, Connection } from 'typeorm';
import * as helmet from 'helmet';
import * as bodyParser from 'body-parser';
import * as swaggerUi from 'swagger-ui-express';
import logger from './service/logger';
import errorMiddleware from './routes/middleware/errorMiddleware';
import v1 from './routes/v1';

import catchAsync from './utils/catchAsync';
import page404 from './routes/root';

const express = require('express');

interface RunAppResult {
  app: any;
  connection: Connection;
  cleanup: () => Promise<void>;
}

const runApp: () => Promise<RunAppResult> = catchAsync(
  async () => {
    logger('info', 'Setting up connections');

    const connection = await createConnection();

    logger('info', 'All connections established, loading express app');
    const app = express();
    app.get('/', (req, res) => {
      res.send('Express working');
    });
    // parse incoming request body and append data to `req.body`
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use('/v1', v1);
    app.use(errorMiddleware);
    app.use(page404);
    app.use(helmet());
    app.use(express.static('public'));
    app.use(
      '/docs',
      swaggerUi.serve,
      swaggerUi.setup(undefined, {
        swaggerOptions: {
          url: '/swagger.json',
        },
      }),
    );

    logger('info', 'Express application is loaded');

    const cleanup = async () => {
      await connection.close();
    };

    return { app, connection, cleanup };
  },
  (error: Error) => {
    logger('critical', `TypeORM connection error: ${error.message}`);
    throw error;
  },
);

export default runApp;
