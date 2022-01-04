import { Request, Response, NextFunction } from 'express';
import HttpException from '../../utils/exceptions/HttpException';

function errorMiddleware(
  error: HttpException,
  request: Request,
  response: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) {
  const status = error.status || 500;
  const message = error.message || 'Something went wrong';
  const { details } = error;
  return response.status(status).send({
    status,
    message,
    details,
  });
}

export default errorMiddleware;
