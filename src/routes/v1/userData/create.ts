/* eslint-disable @typescript-eslint/naming-convention */
import { FastifyInstance } from 'fastify';
import logger from '../../../service/logger';
import { setCustomTransactionName } from '../../../service/newrelic';
import catchAsync from '../../../utils/catchAsync';
import HttpException from '../../../utils/exceptions/HttpException';
import createUserData from '../../../service/userData/create';

export const testableRefs = {
  createUserData,
};

const router = async (fastify: FastifyInstance): Promise<void> => {
  fastify.post<{
    Body: {
      name: string;
      email: string;
    };
  }>(
    '/userData',
    {
      schema: {
        tags: ['user'],
        body: {
          type: 'object',
          required: ['name', 'email'],
          properties: {
            name: { type: 'string' },
            email: { type: 'string' },
          },
        },
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
      setCustomTransactionName('/v1/userData/create');
      await catchAsync(
        async () => {
          const { name, email } = req.body;

          await testableRefs.createUserData({
            name,
            email,
          });

          res.status(200).type('application/json').send({
            success: true,
          });
        },
        (error) => {
          if (error instanceof HttpException) {
            throw error;
          }

          logger('error', `/v1/userData/create: Error ${error}`);

          throw new HttpException(403, 'Forbidden');
        },
      )();
    },
  );
};

export default router;
