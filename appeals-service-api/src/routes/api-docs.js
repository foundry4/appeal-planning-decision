const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerDefinition = require('../docs/swaggerDef');

const router = express.Router();

const specs = swaggerJsdoc({
  swaggerDefinition,
  apis: ['api/openapi.yaml'],
});

router.use('/', swaggerUi.serve);
router
  .get(
    '/',
    swaggerUi.setup(specs, {
      explorer: true,
    })
  )
  .get('/swagger.json', (req, res) => {
    res.send(specs);
  });

module.exports = router;
