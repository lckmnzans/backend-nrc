const swaggerJsDoc = require('swagger-jsdoc');
const { description, version } = require('../package.json');
const { port, hostname } = require('./keys');

const options = {
    swaggerDefinition: {
        info: {
            description,
            version,
            title: 'Archiving NRC API Documentation'
        },
        host: `${hostname}:${port}`,
        basepath: '/api/v1/',
        produces: ['application/json'],
        schemes: [
            'https',
        ],
    },
    apis: ['../router/*.router.js','./router/*.router.js']
}

module.exports = {
    spec() {
        return swaggerJsDoc(options);
    }
};