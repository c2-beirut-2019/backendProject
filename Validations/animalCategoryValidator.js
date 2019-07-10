let Joi = require('joi');

let animalCategoryValidator = {
    addAnimalCategory: {
        options: {
            allowUnknownBody: false,
            status: 400
        },
        body: {
            name: Joi.string().required()
        }
    }
};
module.exports = animalCategoryValidator;
