let paginateService = (model) => {
    let bluebirdPromise = require('bluebird');

    let getData = (query = {}, queryParams = {}, is_populated, populateObj, fieldsSelection = null) => {
        return new bluebirdPromise((resolve, reject) => {
            let options = {};
            if ('sortBy' in queryParams) {
                options.sort = {};
                options.sort[queryParams.sortBy] = queryParams.sortOrder === 'asc' ? 1 : -1;
            }
            queryParams.limit = parseInt(queryParams.limit);
            if ((!('limit')) in queryParams || isNaN(queryParams.limit)) {
                options.limit = 20;
            } else {
                options.limit = queryParams.limit;
            }
            if ((!('pageIndex')) in queryParams) {
                options.skip = 0;
            } else {
                options.skip = (queryParams.pageIndex - 1) * options.limit;
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

    let getAggregationData = (aggregation = [], AggOptions = {}, fieldsSelection = null, predefinedSearchFields = []) => {
        return new bluebirdPromise((resolve, reject) => {
            let options = {};
            let matchQuery = {};
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
            if (predefinedSearchFields && predefinedSearchFields.length > 0 &&
                AggOptions.search && AggOptions.search.length > 0 &&
                AggOptions.searchFields && AggOptions.searchFields.length > 0) {
                let searchQuery = [], searchFields = AggOptions.searchFields.split(',');
                AggOptions.search = decodeURIComponent(AggOptions.search);
                searchFields.forEach((key) => {
                    if (predefinedSearchFields.indexOf(key) > -1) {
                        searchQuery.push({[key]: {$regex: AggOptions.search, $options: "i"}});
                    }
                });
                if (searchQuery.length > 0) {
                    aggregation.push({$match: {$or: searchQuery}});
                }
                if ((searchQuery.length > 0 && 'columnSearch' in AggOptions && Object.keys(AggOptions.columnSearch).length > 0)) {
                    matchQuery = {$match: {$and: [{$and: [AggOptions.columnSearch]}, {$or: searchQuery}]}};
                }
            }
            aggregation.push({$sort: options.sort});
            let optionsArray = [];
            if (matchQuery && Object.keys(matchQuery).length > 0) aggregation.push(matchQuery);
            optionsArray.push({$skip: options.skip});
            optionsArray.push({$limit: parseInt(options.limit)});
            aggregation.push({
                $facet: {
                    metadata: [{$count: "total"}],
                    data: optionsArray // add projection here wish you re-shape the docs
                }
            });
            model.aggregate(aggregation, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        data: result[0].data,
                        pageCount: result[0].metadata[0] ? Math.ceil(result[0].metadata[0].total / options.limit) : 0,
                        totalCount: result[0].metadata[0] ? result[0].metadata[0].total : 0,
                        pageLimit: parseFloat(options.limit)
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

    let getCMSData = (query, page, limit, sort, options = null) => {
        const defaultLimit = 10, defaultPage = 1;

        if (!limit || !Number.isInteger(parseInt(limit))) {
            limit = defaultLimit;
        } else {
            limit = parseInt(limit);
        }

        if (!page || !Number.isInteger(parseInt(page))) {
            page = defaultPage;
        } else {
            page = parseInt(page);
        }

        if (typeof (query) !== 'object') {
            query = {}
        }
        let data = [];
        let response = {
            error: false,
            data: data
        };

        if (options === null || typeof (options) !== 'object') {
            options = {};
        }
        options.page = page;
        options.limit = limit;
        options.sort = sort;
        options.lean = true;

        return new bluebirdPromise((resolve) => {
            model.paginate(query, options, (err, result) => {
                if (err) {
                    response.error = true
                } else {
                    response.data = result.docs;
                    response.currentPage = parseInt(result.page);
                    response.totalPages = result.pages;
                }
                resolve(response);
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
        getAggregationData: getAggregationData,
        getCMSData: getCMSData
    };
};
module.exports = paginateService;