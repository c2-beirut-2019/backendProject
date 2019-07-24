let Joi = require('joi');
Joi.objectID = require('joi-objectid')(Joi);

let petValidator = {
    addPetToAdopt: {
        options: {
            allowUnknownBody: false,
            status: 400
        },
        body: {
            name: Joi.string().required(),
            specie: Joi.objectID().required(),
            color: Joi.string().required(),
            dateOfBirth: Joi.date().required()
        }
    },
    addClientPet: {
        options: {
            allowUnknownBody: false,
            status: 400
        },
        body: {
            name: Joi.string().required(),
            specie: Joi.objectID().required(),
            color: Joi.string().required(),
            dateOfBirth: Joi.date().required(),
            owner: Joi.objectID().required(),
        }
    }
};
module.exports = petValidator;
