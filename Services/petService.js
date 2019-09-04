let Service = () => {
    let blueBirdPromise = require('bluebird');
    let mongoose = require('mongoose');
    let Pet = require('../Models/Pet');
    let paginateService = require('./paginateService')(Pet);
    let uploadService = require('./uploadService')();
    let AnimalSpecies = require('../Models/AnimalSpecies');
    let Appointment = require('../Models/Appointment');

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
                        image: 1,
                        registrationDate: 1,
                        dateOfBirth: 1,
                        category_name: '$category.name',
                        category_id: '$category._id',
                        specie_name: '$specie.name',
                        specie: '$specie._id',
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
                        let newPet = {
                            name: body.name,
                            image: body.image,
                            specie: specie._id,
                            category: specie.category,
                            color: body.color,
                            dateOfBirth: body.dateOfBirth,
                            registrationDate: new Date(),
                            isToAdopt: true
                        };
                        if (body.image) {
                            uploadService.uploadFile(body.image).then((link) => {
                                newPet.image = link;
                                let record = new Pet(newPet);
                                record.save(function (err) {
                                    if (err) {
                                        reject(err);
                                    } else {
                                        resolve()
                                    }
                                })
                            }).catch((err) => {
                                reject(err);
                            })
                        } else {
                            let record = new Pet(newPet);
                            record.save(function (err) {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve()
                                }
                            })
                        }
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
                        let newPet = {
                            name: body.name,
                            image: body.image,
                            specie: specie._id,
                            category: specie.category,
                            color: body.color,
                            dateOfBirth: body.dateOfBirth,
                            registrationDate: new Date(),
                            owner: body.owner
                        };
                        if (body.image) {
                            uploadService.uploadFile(body.image).then((link) => {
                                newPet.image = link;
                                let record = new Pet(newPet);
                                record.save(function (err) {
                                    if (err) {
                                        reject(err);
                                    } else {
                                        resolve()
                                    }
                                })
                            }).catch((err) => {
                                reject(err);
                            })
                        } else {
                            let record = new Pet(newPet);
                            record.save(function (err) {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve()
                                }
                            })
                        }
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
                {
                    $match: {
                        $or: [{isToAdopt: false, isAdopted: false}, {
                            isToAdopt: false,
                            isAdopted: true,
                            owner: {$ne: ''}
                        }]
                    }
                },
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
                        isAdopted: 1,
                        category_name: '$category.name',
                        category_id: '$category._id',
                        specie_name: '$specie.name',
                        specie: '$specie._id',
                        owner_firstName: '$owner.firstName',
                        owner: '$owner._id',
                        owner_lastName: '$owner.lastName',
                        owner_phoneNumber: '$owner.phoneNumber',
                        owner_emergencyPerson: '$owner.emergencyPerson',
                        owner_emergencyNumber: '$owner.emergencyNumber',
                        pet_owner_name: {$concat: ['$name',' ','( ', '$owner.firstName', ' ', '$owner.lastName', ') ']}
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

    let updatePetForAdoption = (id, body) => {
        return new blueBirdPromise((resolve, reject) => {
            AnimalSpecies.findById(body.specie, function (err, specie) {
                if (err) {
                    reject(err);
                } else {
                    if (specie) {
                        body.specie = specie._id;
                        body.category = specie.category;
                        if (body.image) {
                            uploadService.uploadFile(body.image).then((link) => {
                                body.image = link;
                                Pet.findOneAndUpdate({_id: id}, {$set: body}, function (err) {
                                    if (err) {
                                        reject(err);
                                    } else {
                                        resolve();
                                    }
                                })
                            }).catch((err) => {
                                reject(err);
                            })
                        } else {
                            Pet.findOneAndUpdate({_id: id}, {$set: body}, function (err) {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve();
                                }
                            });
                        }
                    } else {
                        reject('not_found');
                    }
                }
            });
        });
    };

    let deletePetForAdoption = (id) => {
        return new blueBirdPromise((resolve, reject) => {
            Pet.findOneAndRemove({_id: id}, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            })
        });
    };

    let updateClientPet = (id, body) => {
        return new blueBirdPromise((resolve, reject) => {
            AnimalSpecies.findById(body.specie, function (err, specie) {
                if (err) {
                    reject(err);
                } else {
                    if (specie) {
                        Pet.findById(id, function (err, pet) {
                            if (err) {
                                reject(err);
                            } else {
                                if (pet) {
                                    if (pet.owner.toString() === body.owner.toString()) {
                                        body.specie = specie._id;
                                        body.category = specie.category;
                                        if (body.image) {
                                            uploadService.uploadFile(body.image).then((link) => {
                                                body.image = link;
                                                Pet.findOneAndUpdate({_id: id}, {$set: body}, function (err) {
                                                    if (err) {
                                                        reject(err);
                                                    } else {
                                                        resolve();
                                                    }
                                                })
                                            }).catch((err) => {
                                                reject(err);
                                            })
                                        } else {
                                            Pet.findOneAndUpdate({_id: id}, {$set: body}, function (err) {
                                                if (err) {
                                                    reject(err);
                                                } else {
                                                    resolve();
                                                }
                                            });
                                        }
                                    } else {
                                        Appointment.findOne({
                                            pet: id,
                                            startDate: {$gte: new Date()}
                                        }, function (err, appointment) {
                                            if (err) {
                                                reject(err);
                                            } else {
                                                if (appointment) {
                                                    reject('cannotUpdateClientPet');
                                                } else {
                                                    body.specie = specie._id;
                                                    body.category = specie.category;
                                                    if (body.image) {
                                                        uploadService.uploadFile(body.image).then((link) => {
                                                            body.image = link;
                                                            Pet.findOneAndUpdate({_id: id}, {$set: body}, function (err) {
                                                                if (err) {
                                                                    reject(err);
                                                                } else {
                                                                    resolve();
                                                                }
                                                            })
                                                        }).catch((err) => {
                                                            reject(err);
                                                        })
                                                    } else {
                                                        Pet.findOneAndUpdate({_id: id}, {$set: body}, function (err) {
                                                            if (err) {
                                                                reject(err);
                                                            } else {
                                                                resolve();
                                                            }
                                                        });
                                                    }
                                                }
                                            }
                                        });
                                    }
                                } else {
                                    reject('not_found');
                                }
                            }
                        })
                    } else {
                        reject('not_found');
                    }
                }
            });
        });
    };

    let deleteClientPet = (id) => {
        return new blueBirdPromise((resolve, reject) => {
            Appointment.findOne({pet: id, startDate: {$gte: new Date()}}, function (err, appointment) {
                if (err) {
                    reject(err);
                } else {
                    if (appointment) {
                        reject('cannotDeleteClientPet');
                    } else {
                        Pet.findOneAndRemove({_id: id}, function (err) {
                            if (err) {
                                reject(err);
                            } else {
                                Appointment.deleteMany({pet: id}, function (err) {
                                    if (err) {
                                        reject(err);
                                    } else {
                                        resolve();
                                    }
                                });
                            }
                        })
                    }
                }
            });
        });
    };

    let adoptPet = (body) => {
        return new blueBirdPromise((resolve, reject) => {
            Pet.findOneAndUpdate({_id: body._id}, {
                $set: {
                    owner: body.owner,
                    isToAdopt: false,
                    isAdopted: true,
                    adoptedDate: new Date()
                }
            }, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            })
        });
    };

    let unAdoptPet = (body) => {
        return new blueBirdPromise((resolve, reject) => {
            Pet.findOneAndUpdate({_id: body._id}, {
                $set: {
                    isToAdopt: true,
                    isAdopted: false
                },
                $unset: {
                    owner: '',
                    adoptedDate: ''
                }
            }, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            })
        });
    };

    let getAdoptedPets = () => {
        return new blueBirdPromise((resolve, reject) => {
            let aggregation = [
                {
                    $match: {isToAdopt: false, isAdopted: true}
                },
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
                        adoptedDate: 1,
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

    return {
        getPetsToAdopt: getPetsToAdopt,
        addPetForAdoption: addPetForAdoption,
        addClientPet: addClientPet,
        getClientPets: getClientPets,
        getLoggedInUserPets: getLoggedInUserPets,
        updatePetForAdoption: updatePetForAdoption,
        deletePetForAdoption: deletePetForAdoption,
        updateClientPet: updateClientPet,
        deleteClientPet: deleteClientPet,
        adoptPet: adoptPet,
        unAdoptPet: unAdoptPet,
        getAdoptedPets: getAdoptedPets
    }
};
module.exports = Service;
