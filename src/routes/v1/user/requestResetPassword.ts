/* eslint-disable @typescript-eslint/naming-convention */
import { Router } from 'express';
import { body } from 'express-validator';
import logger from '../../../service/logger';
import { setCustomTransactionName } from '../../../service/newrelic';
import catchAsync from '../../../utils/catchAsync';
import HttpException from '../../../utils/exceptions/HttpException';
import generateResetPasswordToken from '../../../service/user/generateResetPasswordToken';
import validateInput from '../../../utils/validateInput';

export const testableRefs = {
  generateResetPasswordToken,
};

const route: (route: Router) => void = (router) => {
  setCustomTransactionName('/v1/users/request-password-reset');
  router.post(
    '/request-password-reset',
    [body('email').isEmail()],
    validateInput,
    async (req, res, next) => {
      catchAsync(
        async () => {
          const { email } = req.body;
          await testableRefs.generateResetPasswordToken(email);
          // TODO=> SEND RESET PASSWORD EMAIL
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
