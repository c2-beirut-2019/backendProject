let Joi = require('joi');
Joi.objectID = require('joi-objectid')(Joi);

let animalSpecieValidator = {
    addAnimalSpecie: {
        options: {
            allowUnknownBody: false,
            status: 400
        },
        body: {
            name: Joi.string().required(),
            category: Joi.objectID().required()
        }
    }
};
module.exports = animalSpecieValidator;
