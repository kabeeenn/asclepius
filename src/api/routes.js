const { postPredictHandler } = require('./api/handlers');
const Joi = require('@hapi/joi');

const routes = [
    {
        path: '/predict',
        method: 'POST',
        handler: postPredictHandler,
        options: {
            payload: {
                output: 'stream', 
                parse: true,
                multipart: true,
                maxBytes: 1000000, // Max 1MB (1000000 byte)
            },
            validate: {
                payload: Joi.object({
                    file: Joi.any().required(), 
                }),
            },
        },
    },
    {
        path: '/predict/histories',
        method: 'GET',
        handler: getPredictHistoriesHandler,
    }
];

module.exports = routes;
