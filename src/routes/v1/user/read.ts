import { Router } from 'express';
import { setCustomTransactionName } from '../../../service/newrelic';
import logger from '../../../service/logger';
import catchAsync from '../../../utils/catchAsync';
import HttpException from '../../../utils/exceptions/HttpException';
import getDetails from '../../../service/user/getDetails';

export const testableRefs = {
  getDetails,
};

const route: (route: Router) => void = (router) => {
  setCustomTransactionName('/v1/users/read:id');
  router.get('/:id', async (req, res, next) => {
    catchAsync(
      async () => {
        const { id } = req.params;
        const userData = await testableRefs.getDetails(id);
        if (!userData) {
          throw new HttpException(404, 'Not found');
        }
        res
          .status(200)
          .type('application/json')
          .send({
            data: {
              id,
              email: userData.email,
              name: userData.name,
            },
            message: 'Listed successfully',
          });
      },
      async (error) => {
        logger('error', `/v1/users/read: Error ${error}`, error?.stack);
        if (error instanceof HttpException) {
          next(error);
        }
        next(new HttpException(403, error.message));
      },
    )();
  });
};

export default route;
