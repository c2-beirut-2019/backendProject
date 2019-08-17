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
            images: Joi.array().items(Joi.object({
                extension: Joi.string().required(),
                name: Joi.string().required(),
                data: Joi.string().required()
            })).optional()
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
            images: Joi.array().items(Joi.object({
                extension: Joi.string().required(),
                name: Joi.string().required(),
                data: Joi.string().required()
            })).optional()
        }
    }
};
module.exports = productValidator;
