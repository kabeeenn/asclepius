require('dotenv').config();

const Hapi = require('@hapi/hapi');
const routes = require('./api/routes');
const loadModel = require('./services/loadModel');

const init = async () => {
    const server = Hapi.server({
        port: process.env.PORT,
        host:  process.env.NODE_ENV == "production" ? "0.0.0.0" : "localhost",
        routes: {
            cors: true
        }
    });

    const model = await loadModel();
    server.app.model = model;
    
    server.route(routes);

    server.ext('onPreResponse', function (request, h) {
        const response = request.response;
 
        if (response instanceof InputError) {
            const newResponse = h.response({
                status: 'fail',
                message: `${response.message} Silakan gunakan foto lain.`
            })
            newResponse.code(response.statusCode)
            return newResponse;
        }
 
        if (response.isBoom) {
            const newResponse = h.response({
                status: 'fail',
                message: response.message
            })
            newResponse.code(response.output.statusCode)
            return newResponse;
        }
 
        return h.continue;
    });

    await server.start();
    console.log(`Server running on ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();