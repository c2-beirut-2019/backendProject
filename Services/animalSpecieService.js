let Service = () => {
    let blueBirdPromise = require('bluebird');
    let mongoose = require('mongoose');
    let AnimalSpecie = require('../Models/AnimalSpecies');
    let Pet = require('../Models/Pet');

    let getAnimalSpecies = () => {
        return new blueBirdPromise((resolve, reject) => {
            let aggregation = [
                {$lookup: {from: 'animal_categories', localField: 'category', foreignField: '_id', as: 'category'}},
                {$unwind: {path: '$category', preserveNullAndEmptyArrays: true}},
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        category_name: '$category.name',
                        category_id: '$category._id',
                    }
                },
                {$sort: {name: 1}}
            ];
            AnimalSpecie.aggregate(aggregation).then((result) => {
                resolve(result);
            }).catch((err) => {
                reject(err);
            })
        });
    };

    let addAnimalSpecie = (body) => {
        return new blueBirdPromise((resolve, reject) => {
            let record = new AnimalSpecie({
                name: body.name,
                category: mongoose.Types.ObjectId(body.category)
            });
            record.save(function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve()
                }
            })
        });
    };

    let deleteAnimalSpecie = (id) => {
        return new blueBirdPromise((resolve, reject) => {
            Pet.findOne({specie: id}, function (err, specie) {
                if (err) {
                    reject(err);
                } else {
                    if (specie) {
                        reject('cannotDeleteSpecie');
                    } else {
                        AnimalSpecie.findOneAndRemove({_id: id}, function (err) {
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
        getAnimalSpecies: getAnimalSpecies,
        addAnimalSpecie: addAnimalSpecie,
        deleteAnimalSpecie: deleteAnimalSpecie
    }
};
module.exports = Service;
