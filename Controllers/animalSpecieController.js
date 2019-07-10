let Controller = () => {
    let AnimalSpecieService = require('../Services/animalSpecieService')();
    let messagesService = require('../Services/messagesService');

    let getAnimalSpecies = (req, res) => {
        AnimalSpecieService.getAnimalSpecies().then((result) => {
            res.status(200).send(result);
        }).catch((err) => {
            res.status(500).send(messagesService.serverError);
        });
    };

    let addAnimalSpecie = (req, res) => {
        AnimalSpecieService.addAnimalSpecie(req.body).then(() => {
            res.status(200).send();
        }).catch((err) => {
            res.status(500).send(messagesService.serverError);
        });
    };

    return {
        getAnimalSpecies: getAnimalSpecies,
        addAnimalSpecie: addAnimalSpecie
    }
};
module.exports = Controller;
