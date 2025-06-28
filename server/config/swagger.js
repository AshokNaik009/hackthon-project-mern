const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MERN Hackathon Project API',
      version: '1.0.0',
      description: 'API documentation for MERN stack hackathon project',
    },
    servers: [
      {
        url: 'http://localhost:8003',
        description: 'Development server',
      },
    ],
  },
  apis: ['./routes/*.js', './models/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
};