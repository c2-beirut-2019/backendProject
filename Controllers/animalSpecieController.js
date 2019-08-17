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

    let deleteAnimalSpecie = (req, res) => {
        AnimalSpecieService.deleteAnimalSpecie(req.params.id).then(() => {
            res.status(200).send();
        }).catch((err) => {
            if (err === 'cannotDeleteSpecie') {
                res.status(460).send(messagesService.cannotDeleteSpecie);
            } else {
                res.status(500).send(messagesService.serverError);
            }
        });
    };

    return {
        getAnimalSpecies: getAnimalSpecies,
        addAnimalSpecie: addAnimalSpecie,
        deleteAnimalSpecie: deleteAnimalSpecie
    }
};
module.exports = Controller;
