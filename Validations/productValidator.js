let Joi = require('joi');
Joi.objectID = require('joi-objectid')(Joi);

let productValidator = {
    addProduct: {
        options: {
            allowUnknownBody: false,
            status: 400
        },
        body: {
            title: Joi.string().required(),
            description: Joi.string().required(),
            price: Joi.number().required(),
            quantityAvailable: Joi.number().required(),
            colorsAvailable: Joi.array().items(Joi.string()).required().min(1),
            images: Joi.array().optional().allow('')
        }
    },
    updateProduct: {
        options: {
            allowUnknownBody: false,
            status: 400
        },
        body: {
            title: Joi.string().required(),
            description: Joi.string().required(),
            price: Joi.number().required(),
            quantityAvailable: Joi.number().required(),
            colorsAvailable: Joi.array().items(Joi.string()).required().min(1),
            images: Joi.array().optional().allow('')
        }
    }
};
module.exports = productValidator;
