let Joi = require('joi');

let newsValidator = {
    addNews: {
        options: {
            allowUnknownBody: false,
            status: 400
        },
        body: {
            title: Joi.string().required(),
            content: Joi.string().required(),
            image: Joi.object({
                extension: Joi.string().required(),
                name: Joi.string().required(),
                data: Joi.string().required(),
                size: Joi.number().optional()
            }).optional().allow('')
        }
    },
    getNews: {
        options: {
            allowUnknownBody: false,
            status: 400
        },
        query: {
            page: Joi.number().optional(),
            limit: Joi.number().optional()
        }
    },

    updateNews: {
        options: {
            allowUnknownBody: false,
            status: 400
        },
        body: {
            title: Joi.string().required(),
            content: Joi.string().required(),
            image: Joi.object({
                extension: Joi.string().required(),
                name: Joi.string().required(),
                data: Joi.string().required(),
                size: Joi.number().optional()
            }).optional().allow('')
        }
    },
};
module.exports = newsValidator;
