import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

const router = async (fastify: FastifyInstance) => {
  fastify.all('*', async (req: FastifyRequest, res: FastifyReply) => {
    res.status(400);

    return { message: 'Invalid request' };
  });
};

export default router;
