import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import userDataRoute from './userData';

const router = async (fastify: FastifyInstance) => {
  // fastify.decorateRequest('authData', null);
  // fastify.decorateRequest('pagingData', null);

  await fastify.register(userDataRoute);

  fastify.all('*', async (req: FastifyRequest, res: FastifyReply) => {
    res.status(400);

    return { message: 'Invalid request' };
  });
};

export default router;
