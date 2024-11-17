const swaggerJSDoc = require('swagger-jsdoc');
const path = require('path');

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Content Locker - A Powerful HeadLess CMS Web Application',
        version: '1.0.0',
        description: 'developer - Sushil Kumar',
    },
};

console.log(path.resolve(__dirname, 'routes/**/*.js'))
const options = {
    swaggerDefinition,
    // Dynamically resolve the path to the routes folder
    apis: [path.resolve(__dirname, 'routes/**/*.js')],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;