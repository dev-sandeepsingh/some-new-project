import { FastifyInstance } from 'fastify';
import update from '../../../service/userData/update';
import logger from '../../../service/logger';
import { setCustomTransactionName } from '../../../service/newrelic';
import catchAsync from '../../../utils/catchAsync';
import HttpException from '../../../utils/exceptions/HttpException';
import { ItemDetailsI } from '../../../service/userData/types';

const router = async (fastify: FastifyInstance): Promise<void> => {
  fastify.put<{
    Params: {
      id: number;
    };
    Body: Partial<ItemDetailsI>;
  }>(
    '/userData/:id',
    {
      schema: {
        tags: ['user'],
        body: {
          type: 'object',
          properties: {
            name: { type: 'string' },
          },
        },
        response: {
          200: {
            description: 'Successful response',
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              data: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  name: { type: 'string' },
                  email: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
    async (req, res) => {
      setCustomTransactionName('/v1/userData/:id-put');
      await catchAsync(
        async () => {
          const { id } = req.params;
          const data = req.body;

          const updatedData = await update(id, data);

          if (!updatedData) {
            throw new HttpException(404, 'Not found');
          }

          res.status(200).type('application/json').send({
            success: true,
            data: updatedData,
          });
        },
        (error) => {
          if (error instanceof HttpException) {
            throw error;
          }

          logger('error', `/v1/userData/:id-put: Error ${error}`);

          throw new HttpException(403, 'Forbidden');
        },
      )();
    },
  );
};

export default router;