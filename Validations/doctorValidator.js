let Joi = require('joi');

let clientValidator = {
    addDoctor: {
        options: {
            allowUnknownBody: false,
            status: 400
        },
        body: {
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            speciality: Joi.string().required(),
            diplomas: Joi.string().required(),
            dateOfBirth: Joi.date().optional().allow(null),
            phoneNumber: Joi.string().required()
        }
    },
    validateCode: {
        options: {
            allowUnknownBody: false,
            status: 400
        },
        body: {
            accessCode: Joi.string().required()
        }
    },
    addUsernameAndPassword: {
        options: {
            allowUnknownBody: false,
            status: 400
        },
        body: {
            accessCode: Joi.string().required(),
            username: Joi.string().required(),
            password: Joi.string().required(),
        }
    },
    loginDoctorValidator: {
        options: {
            allowUnknownBody: false,
            status: 400
        },
        body: {
            grant_type: Joi.string().required(),
            username: Joi.string()
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
module.exports = clientValidator;
