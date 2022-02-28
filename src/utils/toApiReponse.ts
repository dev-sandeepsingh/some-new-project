import { Request, Response, NextFunction } from 'express';
import logger from '../service/logger';

const toApiResponse =
  (fn) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status, data, meta = null } = await fn(req, res);
      res.status(status).type('application/json').send({
        success: true,
        status,
        data,
        meta,
      });
    } catch (error) {
      logger('error', `/v1/users/create: Error ${error}`, error?.stack);
      next(error);
    }
  };

export default toApiResponse;
