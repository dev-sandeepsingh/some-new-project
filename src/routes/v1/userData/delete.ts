import { FastifyInstance } from 'fastify';
import deleteUser, { UserNotFound } from '../../../service/userData/delete';
import logger from '../../../service/logger';
import { setCustomTransactionName } from '../../../service/newrelic';
import catchAsync from '../../../utils/catchAsync';
import HttpException from '../../../utils/exceptions/HttpException';

const router = async (fastify: FastifyInstance): Promise<void> => {
  fastify.delete<{
    Params: {
      id: string;
    };
  }>(
    '/userData/:id',
    {
      schema: {
        tags: ['user'],
        response: {
          200: {
            description: 'Successful response',
            type: 'object',
            properties: {
              success: { type: 'boolean' },
            },
          },
        },
      },
    },
    async (req, res) => {
      setCustomTransactionName('/v1/userData/:id-delete');
      await catchAsync(
        async () => {
          const { id } = req.params;
          await deleteUser(Number(id));

          res.status(200).type('application/json').send({
            success: true,
          });
        },
        (error) => {
          if (error instanceof UserNotFound) {
            throw new HttpException(404, 'Not found');
          }

          if (error instanceof HttpException) {
            throw error;
          }

          logger('error', `/v1/userData/:id-delete: Error ${error}`);

          throw new HttpException(403, 'Forbidden');
        },
      )();
    },
  );
};

export default router;
