let Service = () => {
    let blueBirdPromise = require('bluebird');
    let mongoose = require('mongoose');
    let Pet = require('../Models/Pet');
    let paginateService = require('./paginateService')(Pet);
    let AnimalSpecies = require('../Models/AnimalSpecies');

    let getPetsToAdopt = (query, page, limit, sortBy, sortOrder, search, specie, category) => {
        return new blueBirdPromise((resolve, reject) => {
            let aggregation = [
                {$match: query},
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
                            isToAdopt: true,
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

    let addClientPet = (body) => {
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
                            owner: body.owner
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

    let getClientPets = () => {
        return new blueBirdPromise((resolve, reject) => {
            let aggregation = [
                {$match: {isToAdopt: false, isAdopted: false}},
                {$lookup: {from: 'animal_species', localField: 'specie', foreignField: '_id', as: 'specie'}},
                {$unwind: {path: '$specie', preserveNullAndEmptyArrays: true}},
                {$lookup: {from: 'animal_categories', localField: 'category', foreignField: '_id', as: 'category'}},
                {$unwind: {path: '$category', preserveNullAndEmptyArrays: true}},
                {$lookup: {from: 'users', localField: 'owner', foreignField: '_id', as: 'owner'}},
                {$unwind: {path: '$owner', preserveNullAndEmptyArrays: true}},
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
                        owner_firstName: '$owner.firstName',
                        owner_lastName: '$owner.lastName',
                        owner_phoneNumber: '$owner.phoneNumber',
                        owner_emergencyPerson: '$owner.emergencyPerson',
                        owner_emergencyNumber: '$owner.emergencyNumber',
                    }
                }
            ];
            Pet.aggregate(aggregation).then((result) => {
                resolve(result);
            }).catch((err) => {
                reject(err);
            })
        });
    };

    let getLoggedInUserPets = (ownerID) => {
        return new blueBirdPromise((resolve, reject) => {
            let aggregation = [
                {$match: {isToAdopt: false, isAdopted: false, owner: mongoose.Types.ObjectId(ownerID)}},
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
                        specie_id: '$specie._id'
                    }
                }
            ];
            Pet.aggregate(aggregation).then((result) => {
                resolve(result);
            }).catch((err) => {
                reject(err);
            })
        });
    };

    return {
        getPetsToAdopt: getPetsToAdopt,
        addPetForAdoption: addPetForAdoption,
        addClientPet: addClientPet,
        getClientPets: getClientPets,
        getLoggedInUserPets:getLoggedInUserPets
    }
};
module.exports = Service;
