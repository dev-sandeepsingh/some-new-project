/* eslint-disable @typescript-eslint/naming-convention */
import { Router } from 'express';
import logger from '../../../service/logger';
import { setCustomTransactionName } from '../../../service/newrelic';
import catchAsync from '../../../utils/catchAsync';
import HttpException from '../../../utils/exceptions/HttpException';
import createUserData from '../../../service/userData/create';

export const testableRefs = {
  createUserData,
};

const route: (route: Router) => void = (router) => {
  setCustomTransactionName('/v1/userData/create');
  router.post('/', async (req, res, next) => {
    catchAsync(
      async () => {
        const { name, email } = req.body;

        await testableRefs.createUserData({
          name,
          email,
        });

        res.status(200).type('application/json').send({
          success: true,
        });
      },
      async (error) => {
        logger('error', `/v1/userData/create: Error ${error}`, error?.stack);
        if (error instanceof HttpException) {
          next(error);
        }
        next(new HttpException(403, error.message));
      },
    )();
  });
};

export default route;
