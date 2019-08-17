let Service = () => {
    let blueBirdPromise = require('bluebird');
    let AnimalCategory = require('../Models/AnimalCategory');
    let AnimalSpecie = require('../Models/AnimalSpecies');

    let getAnimalCategories = () => {
        return new blueBirdPromise((resolve, reject) => {
            AnimalCategory.find({}).sort({name: 1}).then((result) => {
                resolve(result);
            }).catch((err) => {
                reject(err);
            })
        });
    };

    let addAnimalCategory = (body) => {
        return new blueBirdPromise((resolve, reject) => {
            let record = new AnimalCategory(body);
            record.save(function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve()
                }
            })
        });
    };

    let deleteAnimalCategory = (id) => {
        return new blueBirdPromise((resolve, reject) => {
            AnimalSpecie.findOne({category: id}, function (err, specie) {
                if (err) {
                    reject(err);
                } else {
                    if (specie) {
                        reject('cannotDeleteCategory');
                    } else {
                        AnimalCategory.findOneAndRemove({_id: id}, function (err) {
                            if (err) {
                                reject(err);
                            } else {
                                resolve();
                            }
                        })
                    }
                }
            });
        });
    };

    return {
        getAnimalCategories: getAnimalCategories,
        addAnimalCategory: addAnimalCategory,
        deleteAnimalCategory: deleteAnimalCategory
    }
};
module.exports = Service;
