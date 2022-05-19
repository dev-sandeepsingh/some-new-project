/* eslint-disable @typescript-eslint/naming-convention */
import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import logger from '../../../service/logger';
import catchAsync from '../../../utils/catchAsync';
import HttpException from '../../../utils/exceptions/HttpException';
import getCreatePresignedUrl from '../../../service/aws/get-presigned-url';

export const testableRefs = {
  getCreatePresignedUrl,
};

const route: (route: Router) => void = (router) => {
  router.get('/presignedUrl', async (req: Record<string, any>, res, next) => {
    catchAsync(
      async () => {
        const { file } = req.query;

        const uniqueFileName = `${uuidv4()}${file}`;
        const presignedData = await testableRefs.getCreatePresignedUrl(
          'user',
          uniqueFileName,
        );

        res.status(200).type('application/json').send({
          data: presignedData,
          message: 'Presigned url created successfully.',
        });
      },
      async (error) => {
        logger('error', `/v1/s3/presignedUrl: Error ${error}`, error?.stack);
        if (error instanceof HttpException) {
          next(error);
        }
        next(new HttpException(403, error.message));
      },
    )();
  });
};

export default route;
