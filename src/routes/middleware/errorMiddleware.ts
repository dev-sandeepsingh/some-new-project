import { FastifyRequest, FastifyReply, FastifyError } from 'fastify';
import { beginSegment } from '../../service/newrelic';
import logger from '../../service/logger';
import HttpException from '../../utils/exceptions/HttpException';

async function errorMiddleware(
  error: HttpException | Error,
  request: FastifyRequest,
  response: FastifyReply,
) {
  const endSegment = beginSegment('errorMiddleware');

  const isHttpException = error instanceof HttpException;
  const isRateLimitError = response.statusCode === 429;
  const isValidationError = !!(error as FastifyError).validation;

  if (!isHttpException && !isRateLimitError && !isValidationError) {
    logger(
      'error',
      `Unexpected error occured: "${error.message}"`,
      error?.stack,
    );
    logger('debug', `Error stack: "${error.stack}"`);
  }

  const status = (error as any).status || response.statusCode || 500;
  const message = error.message || 'Something went wrong';
  const details = (error as any).details || null;

  response.status(status).type('application/json').send({
    message,
    details,
  });

  endSegment();
}

export default errorMiddleware;
