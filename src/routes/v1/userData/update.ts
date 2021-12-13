import { Router } from 'express';
import update from '../../../service/userData/update';
import logger from '../../../service/logger';
import { setCustomTransactionName } from '../../../service/newrelic';
import catchAsync from '../../../utils/catchAsync';
import HttpException from '../../../utils/exceptions/HttpException';

const route: (route: Router) => void = (router) => {
  setCustomTransactionName('/v1/users/:id-put');
  router.put('/:id', async (req, res, next) => {
    catchAsync(
      async () => {
        const { id } = req.params;
        const data = req.body;

        const updatedData = await update(Number(id), data);

        if (!updatedData) {
          throw new HttpException(404, 'Not found');
        }
        res.status(200).type('application/json').send({
          success: true,
          data: updatedData,
        });
      },
      async (error) => {
        logger('error', `/v1/users/:id-put: Error ${error}`);
        if (error instanceof HttpException) {
          next(error);
        }
        next(new HttpException(403, error.message));
      },
    )();
  });
};

export default route;
