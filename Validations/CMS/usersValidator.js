let Joi = require('joi');
Joi.objectID = require('joi-objectid')(Joi);
let usersValidator = {
    addUserValidator: {
        options: {
            allowUnknownBody: false
        },
        body: {
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            email: Joi.string().required(),
            profiles: Joi.array().items(Joi.objectID().optional()).optional()
        }
    },
    updateUserValidator: {
        options: {
            allowUnknownBody: false
        },
        body: {
            _id: Joi.objectID().required(),
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            email: Joi.string().required(),
            profiles: Joi.array().items(Joi.objectID().optional()).optional()
        }
    },
    deactivateUsersValidator: {
        options: {
            allowUnknownBody: false
        },
        body: {
            users: Joi.array().items(Joi.objectID().required()).required()
        }
    }
};
module.exports = usersValidator;
