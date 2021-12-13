/* eslint-disable @typescript-eslint/naming-convention */
import { Router } from 'express';
import logger from '../../../service/logger';
import { setCustomTransactionName } from '../../../service/newrelic';
import catchAsync from '../../../utils/catchAsync';
import HttpException from '../../../utils/exceptions/HttpException';
import createUserData from '../../../service/userData/create';

const router = Router();

export const testableRefs = {
  createUserData,
};

router.post('/:id', async (req, res) => {
  setCustomTransactionName('/v1/userData/:id-delete');
  await catchAsync(
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
    (error) => {
      if (error instanceof HttpException) {
        throw error;
      }

      logger('error', `/v1/userData/create: Error ${error}`);

      throw new HttpException(403, 'Forbidden');
    },
  )();
});

export default router;
