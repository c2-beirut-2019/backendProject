let paginateService = (model) => {
    let bluebirdPromise = require('bluebird');

    let getData = (query = {}, queryParams = {}, is_populated, populateObj, fieldsSelection = null) => {
        return new bluebirdPromise((resolve, reject) => {
            let options = {};
            if ('sortBy' in queryParams) {
                options.sort = {};
                options.sort[queryParams.sortBy] = queryParams.sortOrder === 'asc' ? 1 : -1;
            }
            options.lean = true;
            if (is_populated) {
                model.find(query, fieldsSelection, options, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        model.countDocuments(query, (err, count) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve({
                                    data: result,
                                    pageCount: Math.ceil(count / options.limit),
                                    totalCount: count,
                                    pageLimit: options.limit
                                });
                            }
                        });
                    }
                }).populate(populateObj);
            } else {
                model.find(query, fieldsSelection, options, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        model.countDocuments(query, (err, count) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve({
                                    data: result,
                                    pageCount: Math.ceil(count / options.limit),
                                    totalCount: count,
                                    pageLimit: options.limit
                                });
                            }
                        });
                    }
                });
            }
        });
    };

    let getAggregationData = (aggregation = [], AggOptions = {}, fieldsSelection = null) => {
        return new bluebirdPromise((resolve, reject) => {
            let options = {};
            options.limit = parseInt(options.limit);
            if ((!('limit')) in AggOptions || isNaN(AggOptions.limit)) {
                options.limit = 20;
            } else {
                options.limit = AggOptions.limit;
            }
            if ((!('pageIndex')) in AggOptions) {
                options.skip = 0;
            } else {
                options.skip = (AggOptions.pageIndex - 1) * options.limit;
            }
            if ('sortBy' in AggOptions) {
                options.sort = {};
                options.sort[AggOptions.sortBy] = AggOptions.sortOrder === 'asc' ? 1 : -1;
            }
            if (fieldsSelection) {
                aggregation.push({$project: fieldsSelection});
            }
            aggregation.push({$sort: options.sort});
            model.aggregate(aggregation, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        data: result[0].data,
                        pageCount: result[0].metadata[0] ? Math.ceil(result[0].metadata[0].total / options.limit) : 0,
                        totalCount: result[0].metadata[0] ? result[0].metadata[0].total : 0,
                        pageLimit: options.limit
                    });
                }
            });
        });
    };

    let getDataById = (id) => {
        return new bluebirdPromise((resolve, reject) => {
            model.findById(id, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    };

    let addData = (data) => {
        return new bluebirdPromise((resolve, reject) => {
            let item = new model(data);
            item.save((err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    };

    let updateData = (data) => {
        return new bluebirdPromise((resolve, reject) => {
            const options = {
                upsert: true
            };
            const id = data.id;
            delete data.id;

            model.findOneAndUpdate(id, data, options, (err, result) => {
                err ? reject(err) : resolve(result);
            });
        });
    };

    let findAndUpdateData = (query, data) => {
        return new bluebirdPromise((resolve, reject) => {
            const options = {
                upsert: true
            };
            model.update(query, data, options, (err, result) => {
                err ? reject(err) : resolve(result);
            });
        });
    };

    let deleteData = (id) => {
        return new bluebirdPromise((resolve, reject) => {
            model.findOneAndRemove(id, (err) => {
                err ? reject(err) : resolve();
            });
        });
    };

    let deleteDataByQuery = (query) => {
        return new bluebirdPromise((resolve, reject) => {
            model.remove(query, (err) => {
                err ? reject(err) : resolve();
            });
        });
    };

    return {
        getData: getData,
        getDataById: getDataById,
        addData: addData,
        updateData: updateData,
        findAndUpdateData: findAndUpdateData,
        deleteData: deleteData,
        deleteDataByQuery: deleteDataByQuery,
        getAggregationData: getAggregationData
    };
};
module.exports = paginateService;