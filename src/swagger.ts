import { SwaggerOptions } from 'fastify-swagger';

const packageInfo = require('../package.json');

const swaggerConfig: SwaggerOptions = {
  routePrefix: '/docs',
  swagger: {
    info: {
      title: 'nodejs-boilerplate',
      description: 'API for nodejs boileplate',
      version: packageInfo.version,
    },
    host: 'nodejsboilerplate',
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
      {
        name: 'user',
        description: 'End-points dedicated for user',
      },
    ],
  },
  uiConfig: {
    docExpansion: 'none',
    deepLinking: true,
  },
  staticCSP: true,
  exposeRoute: true,
  hideUntagged: true,
  hiddenTag: 'hide',
};

export default swaggerConfig;
