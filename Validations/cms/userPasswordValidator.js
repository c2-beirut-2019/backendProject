let Joi = require('joi');
Joi.objectID = require('joi-objectid')(Joi);
let userValidator = {
    changePasswordValidator: {
        options: {
            allowUnknownBody: false
        },
        body: {
            oldPassword: Joi.string().required(),
            password: Joi.string().required()
        }
    },
    forgotPasswordValidator: {
        options: {
            allowUnknownBody: false
        },
        body: {
            email: Joi.string().required()
        }
    },
    resetPasswordValidator: {
        options: {
            allowUnknownBody: false
        },
        body: {
            token: Joi.string().required(),
            password: Joi.string().required()
        }
    }
};
module.exports = userValidator;
