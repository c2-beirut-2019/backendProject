let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let newsModel = new Schema({
    title: String,
    content: String,
    image: {
        extension: String,
        name: String,
        data: String,
    },
    creationDate: Date,
    __v: {type: Number, select: false}
});
module.exports = mongoose.model('News', newsModel);
