let Controller = () => {
    let petService = require('../Services/petService')();
    let appointmentService = require('../Services/appointmentService')();
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

    let adoptPet = (req, res) => {
        petService.adoptPet(req.body).then(() => {
            res.status(200).send();
        }).catch((err) => {
            res.status(500).send(messagesService.serverError);
        });
    };

    let unAdoptPet = (req, res) => {
        petService.unAdoptPet(req.body).then(() => {
            res.status(200).send();
        }).catch((err) => {
            res.status(500).send(messagesService.serverError);
        });
    };

    let getAdoptedPets = (req, res) => {
        petService.getAdoptedPets().then((result) => {
            res.status(200).send(result);
        }).catch((err) => {
            res.status(500).send(messagesService.serverError);
        });
    };

    let addPetAppointment = (req, res) => {
        req.body.pet = req.body._id;
        appointmentService.addAppointment(null, req.body, true).then(() => {
            res.status(200).send();
        }).catch((err) => {
            if (err === 'not_found') {
                res.status(460).send(messagesService.not_found);
            } else if (err === 'appointment_exists') {
                res.status(460).send(messagesService.appointmentExists);
            } else if (err === 'doctor_not_available') {
                res.status(460).send(messagesService.doctorNotAvailable);
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
        deleteClientPet: deleteClientPet,
        adoptPet: adoptPet,
        unAdoptPet: unAdoptPet,
        getAdoptedPets: getAdoptedPets,
        addPetAppointment: addPetAppointment
    }
};
module.exports = Controller;
