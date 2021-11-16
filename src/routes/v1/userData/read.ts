import { FastifyInstance } from 'fastify';
import { setCustomTransactionName } from '../../../service/newrelic';
import logger from '../../../service/logger';
import catchAsync from '../../../utils/catchAsync';
import HttpException from '../../../utils/exceptions/HttpException';
// import authMiddleware from '../../middleware/authMiddleware';

const router = async (fastify: FastifyInstance): Promise<void> => {
  fastify.get<{
    Params: { id: string };
  }>(
    '/userData/:id',
    {
      // preHandler: authMiddleware(),
      schema: {
        tags: ['boilerplate'],
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: {
              type: 'number',
            },
          },
        },
        response: {
          200: {
            description: 'Successful response',
            type: 'object',
            properties: {
              data: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  name: { type: 'string', nullable: true },
                },
              },
              message: { type: 'string' },
            },
          },
        },
      },
    },
    async (req, res) => {
      setCustomTransactionName('/v1/userData/read');

      await catchAsync(
        async () => {
          const { id } = req.params;
          const userData = {id:1, name : 'Sandeep'};

          if (!userData) {
            throw new HttpException(404, 'Not found');
          }

          res
            .status(200)
            .type('application/json')
            .send({
              data: {
                id,
                name: userData.name,
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
    },
  );
};

export default router;
