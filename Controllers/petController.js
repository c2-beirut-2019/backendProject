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

    return {
        getPetsToAdopt: getPetsToAdopt,
        addPetToAdopt: addPetToAdopt,
        addClientPet: addClientPet,
        getClientPets: getClientPets,
        getLoginUserPets: getLoginUserPets
    }
};
module.exports = Controller;
