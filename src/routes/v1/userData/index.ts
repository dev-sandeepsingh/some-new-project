import { FastifyInstance } from 'fastify';
import readRoute from './read';
import addRoute from './create';
import updateRoute from './update';

const router = async (fastify: FastifyInstance): Promise<void> => {
  await fastify.register(readRoute);
  await fastify.register(addRoute);
  await fastify.register(updateRoute);
};

export default router;
