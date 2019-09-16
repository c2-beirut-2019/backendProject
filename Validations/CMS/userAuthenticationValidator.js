let Joi = require('joi');
Joi.objectID = require('joi-objectid')(Joi);
let userValidator = {
    addUserValidator: {
        options: {
            allowUnknownBody: false
        },
        body: {
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            email: Joi.string().required(),
            phoneNumber: Joi.string().required(),
            password: Joi.string().required(),
            profiles: Joi.array().items(Joi.objectID().required()).required()
        }
    },
    deactivateUserValidator: {
        options: {
            allowUnknownBody: false
        },
        body: {
            user: Joi.objectID().required()
        }
    },
    loginUserValidator: {
        options: {
            allowUnknownBody: false,
            status: 400
        },
        body: {
            grant_type: Joi.string().required(),
            email: Joi.string()
                .when('grant_type', {
                    is: 'password',
                    then: Joi.string().required()
                }),
            password: Joi.string()
                .when('grant_type', {
                    is: 'password',
                    then: Joi.string().required()
                }),
            refresh_token: Joi.string()
                .when('grant_type', {
                    is: 'refresh_token',
                    then: Joi.string().required()
                })
        }
    }
};
module.exports = userValidator;
