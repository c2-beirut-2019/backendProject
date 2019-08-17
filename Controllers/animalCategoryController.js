let Controller = () => {
    let AnimalCategoryService = require('../Services/animalCategoryService')();
    let messagesService = require('../Services/messagesService');

    let getAnimalCategory = (req, res) => {
        AnimalCategoryService.getAnimalCategories().then((result) => {
            res.status(200).send(result);
        }).catch((err) => {
            res.status(500).send(messagesService.serverError);
        });
    };

    let addAnimalCategory = (req, res) => {
        AnimalCategoryService.addAnimalCategory(req.body).then(() => {
            res.status(200).send();
        }).catch((err) => {
            res.status(500).send(messagesService.serverError);
        });
    };

    let deleteAnimalCategory = (req, res) => {
        AnimalCategoryService.deleteAnimalCategory(req.params.id).then(() => {
            res.status(200).send();
        }).catch((err) => {
            if (err === 'cannotDeleteCategory') {
                res.status(460).send(messagesService.cannotDeleteCategory);
            } else {
                res.status(500).send(messagesService.serverError);
            }
        });
    };

    return {
        getAnimalCategory: getAnimalCategory,
        addAnimalCategory: addAnimalCategory,
        deleteAnimalCategory: deleteAnimalCategory
    }
};
module.exports = Controller;
