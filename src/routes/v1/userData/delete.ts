import { Router } from 'express';
import deleteUser, { UserNotFound } from '../../../service/userData/delete';
import logger from '../../../service/logger';
import { setCustomTransactionName } from '../../../service/newrelic';
import catchAsync from '../../../utils/catchAsync';
import HttpException from '../../../utils/exceptions/HttpException';

const route: (route: Router) => void = (router) => {
  setCustomTransactionName('/v1/users/:id-delete');
  router.delete('/:id', async (req, res, next) => {
    catchAsync(
      async () => {
        const { id } = req.params;
        await deleteUser(Number(id));

        res.status(200).type('application/json').send({
          success: true,
        });
      },
      async (error) => {
        logger('error', `/v1/users/:id-delete: Error ${error}`);

        if (error instanceof UserNotFound) {
          next(new HttpException(404, 'Not found'));
        }
        if (error instanceof HttpException) {
          next(error);
        }
        throw new HttpException(403, 'Forbidden');
      },
    )();
  });
};

export default route;
