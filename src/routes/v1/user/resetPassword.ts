/* eslint-disable @typescript-eslint/naming-convention */
import { Router } from 'express';
import { body } from 'express-validator';
import logger from '../../../service/logger';
import { setCustomTransactionName } from '../../../service/newrelic';
import catchAsync from '../../../utils/catchAsync';
import HttpException from '../../../utils/exceptions/HttpException';
import resetPassword from '../../../service/user/resetPassword';
import validateInput from '../../../utils/validateInput';

export const testableRefs = {
  resetPassword,
};

const route: (route: Router) => void = (router) => {
  setCustomTransactionName('/v1/users/reset-password');
  router.post(
    '/reset-password',
    [body('token').notEmpty(), body('password').isLength({ min: 5, max: 30 })],
    validateInput,
    async (req, res, next) => {
      catchAsync(
        async () => {
          const { token, password } = req.body;
          await testableRefs.resetPassword(password, token);
          res.status(204).type('application/json').send({
            success: true,
          });
        },
        async (error) => {
          logger(
            'error',
            `/v1/users/requestPasswordReset: Error ${error}`,
            error?.stack,
          );
          if (error instanceof HttpException) {
            next(error);
          }
          next(new HttpException(403, error.message));
        },
      )();
    },
  );
};

export default route;
