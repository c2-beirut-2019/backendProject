let Controller = () => {
    let petService = require('../Services/petService')();
    let messagesService = require('../Services/messagesService');

    let getPetsToAdopt = (req, res) => {
        petService.getPetsToAdopt({isToAdopt: true}, req.query.page, req.query.limit, req.query.sortBy, req.query.sortOrder, req.query.search, req.query.specie_id, req.query.category_id).then((result) => {
            res.status(200).send(result);
        }).catch((err) => {
            res.status(500).send(messagesService.serverError);
        });
    };

    let addPetToAdopt = (req, res) => {
        petService.addPetForAdoption(req.body).then(() => {
            res.status(200).send();
        }).catch((err) => {
            if (err === 'not_found') {
                res.status(404).send(messagesService.not_found);
            } else {
                res.status(500).send(messagesService.serverError);
            }
        });
    };

    let addClientPet = (req, res) => {
        petService.addClientPet(req.body).then(() => {
            res.status(200).send();
        }).catch((err) => {
            if (err === 'not_found') {
                res.status(404).send(messagesService.not_found);
            } else {
                res.status(500).send(messagesService.serverError);
            }
        });
    };

    let getClientPets = (req, res) => {
        petService.getClientPets().then((result) => {
            res.status(200).send(result);
        }).catch((err) => {
            res.status(500).send(messagesService.serverError);
        });
    };

    let getLoginUserPets = (req, res) => {
        petService.getLoggedInUserPets(req.user._id).then((result) => {
            res.status(200).send(result);
        }).catch((err) => {
            res.status(500).send(messagesService.serverError);
        });
    };

    let updatePetForAdoption = (req, res) => {
        petService.updatePetForAdoption(req.params.id, req.body).then(() => {
            res.status(200).send();
        }).catch((err) => {
            if (err === 'not_found') {
                res.status(404).send(messagesService.not_found);
            } else {
                res.status(500).send(messagesService.serverError);
            }
        });
    };

    let deletePetForAdoption = (req, res) => {
        petService.deletePetForAdoption(req.params.id).then(() => {
            res.status(200).send();
        }).catch((err) => {
            if (err === 'not_found') {
                res.status(404).send(messagesService.not_found);
            } else {
                res.status(500).send(messagesService.serverError);
            }
        });
    };

    let updateClientPet = (req, res) => {
        petService.updateClientPet(req.params.id, req.body).then(() => {
            res.status(200).send();
        }).catch((err) => {
            if (err === 'cannotUpdateClientPet') {
                res.status(460).send(messagesService.cannotUpdateClientPet);
            } else if (err === 'not_found') {
                res.status(404).send(messagesService.not_found);
            } else {
                res.status(500).send(messagesService.serverError);
            }
        });
    };

    let deleteClientPet = (req, res) => {
        petService.deleteClientPet(req.params.id).then(() => {
            res.status(200).send();
        }).catch((err) => {
            if (err === 'cannotDeleteClientPet') {
                res.status(460).send(messagesService.cannotDeleteClientPet);
            } else if (err === 'not_found') {
                res.status(404).send(messagesService.not_found);
            } else {
                res.status(500).send(messagesService.serverError);
            }
        });
    };

    return {
        getPetsToAdopt: getPetsToAdopt,
        addPetToAdopt: addPetToAdopt,
        addClientPet: addClientPet,
        getClientPets: getClientPets,
        getLoginUserPets: getLoginUserPets,
        updatePetForAdoption: updatePetForAdoption,
        deletePetForAdoption: deletePetForAdoption,
        updateClientPet: updateClientPet,
        deleteClientPet: deleteClientPet
    }
};
module.exports = Controller;
