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
            dateOfBirth: Joi.date().required(),
            image: Joi.object({
                extension: Joi.string().required(),
                name: Joi.string().required(),
                data: Joi.string().required()
            }).optional()
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
            image: Joi.object({
                extension: Joi.string().required(),
                name: Joi.string().required(),
                data: Joi.string().required()
            }).optional()
        }
    }
};
module.exports = petValidator;
