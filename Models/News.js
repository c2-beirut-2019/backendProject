let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let newsModel = new Schema({
    title: String,
    content: String,
    image: String,
    creationDate: Date,
    __v: {type: Number, select: false}
});
module.exports = mongoose.model('News', newsModel);
