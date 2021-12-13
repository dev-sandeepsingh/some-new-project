import { Request, Response, Router } from 'express';
import { setCustomTransactionName } from '../../../service/newrelic';
import logger from '../../../service/logger';
import catchAsync from '../../../utils/catchAsync';
import HttpException from '../../../utils/exceptions/HttpException';
import getDetails from '../../../service/userData/getDetails';

const router = Router();

export const testableRefs = {
  getDetails,
};

router.get('/:id', async (req: Request, res: Response) => {
  setCustomTransactionName('/v1/userData/:id-delete');
  await catchAsync(
    async () => {
      const { id } = req.params;
      const userData = await testableRefs.getDetails(id);

      if (!userData) {
        throw new HttpException(404, 'Not found');
      }

      return res
        .status(200)
        .type('application/json')
        .send({
          data: {
            id,
            name: userData.name,
            email: userData.email,
          },
          message: 'Listed successfully',
        });
    },
    (error) => {
      if (error instanceof HttpException) {
        throw error;
      }

      logger('error', `/v1/userData/read: Error ${error}`, error?.stack);

      throw new HttpException(403, 'Forbidden');
    },
  )();
});

export default router;
