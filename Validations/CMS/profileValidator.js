let Joi = require('joi');
Joi.objectID = require('joi-objectid')(Joi);
let profileValidator = {
    addProfileValidator: {
        options: {
            allowUnknownBody: false,
            status: 400
        },
        body: {
            name: Joi.string().required(),
            permissions: Joi.object().required()
        }
    },
    updateProfileValidator: {
        options: {
            allowUnknownBody: false,
            status: 400
        },
        body: {
            _id: Joi.objectID().required(),
            name: Joi.string().required(),
            permissions: Joi.object().required()
        }
    },
    deleteProfileValidator: {
        options: {
            allowUnknownBody: false,
            status: 400
        },
        params: {
            id: Joi.objectID().required()
        }
    }
};
module.exports = profileValidator;
