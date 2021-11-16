import { FastifyInstance } from 'fastify';
import readRoute from './read';
import addRoute from './create';

const router = async (fastify: FastifyInstance): Promise<void> => {
  await fastify.register(readRoute);
  await fastify.register(addRoute);
};

export default router;
