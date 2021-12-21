/* eslint-disable @typescript-eslint/naming-convention */
import { Router } from 'express';
import logger from '../../../service/logger';
import { setCustomTransactionName } from '../../../service/newrelic';
import catchAsync from '../../../utils/catchAsync';
import HttpException from '../../../utils/exceptions/HttpException';
import createUser from '../../../service/user/create';
import { body } from 'express-validator';
import { validateInput } from '../../../utils/validate-input';

export const testableRefs = {
  createUser,
};

const route: (route: Router) => void = (router) => {
  setCustomTransactionName('/v1/users/create');
  router.post('/',
    [
      body('email').isEmail(),
      body('password').notEmpty(),
      body('name').notEmpty(),
    ],
    validateInput,
    async (req, res, next) => {
      catchAsync(
        async () => {
          const { password, email, name } = req.body;
          await testableRefs.createUser({
            email,
            password,
            name
          });

          res.status(200).type('application/json').send({
            success: true,
          });
        },
        async (error) => {
          logger('error', `/v1/users/create: Error ${error}`, error?.stack);
          if (error instanceof HttpException) {
            next(error);
          }
          next(new HttpException(403, error.message));
        },
      )();
    });
};

export default route;
