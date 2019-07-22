let Service = () => {
    let blueBirdPromise = require('bluebird');
    let mongoose = require('mongoose');
    let Pet = require('../Models/Pet');
    let paginateService = require('./paginateService')(Pet);
    let AnimalSpecies = require('../Models/AnimalSpecies');

    let getPetsToAdopt = (query, page, limit, sortBy, sortOrder, search, specie, category) => {
        return new blueBirdPromise((resolve, reject) => {
            let aggregation = [
                {$lookup: {from: 'animal_species', localField: 'specie', foreignField: '_id', as: 'specie'}},
                {$unwind: {path: '$specie', preserveNullAndEmptyArrays: true}},
                {$lookup: {from: 'animal_categories', localField: 'category', foreignField: '_id', as: 'category'}},
                {$unwind: {path: '$category', preserveNullAndEmptyArrays: true}},
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        color: 1,
                        registrationDate: 1,
                        dateOfBirth: 1,
                        category_name: '$category.name',
                        category_id: '$category._id',
                        specie_name: '$specie.name',
                        specie_id: '$specie._id',
                    }
                }
            ];
            if (specie) {
                aggregation.push({$match: {specie_id: mongoose.Types.ObjectId(specie)}});
            }
            if (category) {
                aggregation.push({$match: {category_id: mongoose.Types.ObjectId(category)}});
            }
            if (page) {
                if (!sortBy) {
                    sortBy = 'registrationDate';
                    sortOrder = 'desc'
                }
                let searchFor = ['name', 'color', 'category_name', 'specie_name'];
                let searchFields = 'name,color,category_name,specie_name';
                paginateService.getAggregationData(aggregation, {
                    pageIndex: page,
                    limit: limit,
                    sortBy: sortBy,
                    sortOrder: sortOrder,
                    search: search,
                    searchFields: searchFields
                }, null, searchFor).then((result) => {
                    resolve(result);
                }).catch((err) => {
                    reject(err);
                })
            } else {
                Pet.aggregate(aggregation).then((result) => {
                    resolve(result);
                }).catch((err) => {
                    reject(err);
                })
            }
        });
    };

    let addPetForAdoption = (body) => {
        return new blueBirdPromise((resolve, reject) => {
            AnimalSpecies.findById(body.specie, function (err, specie) {
                if (err) {
                    reject(err);
                } else {
                    if (specie) {
                        let record = new Pet({
                            name: body.name,
                            specie: specie._id,
                            category: specie.category,
                            color: body.color,
                            dateOfBirth: body.dateOfBirth,
                            registrationDate: new Date(),
                            isToAdopt: true
                        });
                        record.save(function (err) {
                            if (err) {
                                reject(err);
                            } else {
                                resolve()
                            }
                        })
                    } else {
                        reject('not_found');
                    }
                }
            });
        });
    };

    return {
        getPetsToAdopt: getPetsToAdopt,
        addPetForAdoption: addPetForAdoption
    }
};
module.exports = Service;
