import { FastifyInstance } from 'fastify';
import readRoute from './read';
import addRoute from './create';
import updateRoute from './update';
import deleteRoute from './delete';

const router = async (fastify: FastifyInstance): Promise<void> => {
  await fastify.register(readRoute);
  await fastify.register(addRoute);
  await fastify.register(updateRoute);
  await fastify.register(deleteRoute);
};

export default router;
