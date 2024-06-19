const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//mongoDB schema
const user_schema = new mongoose.Schema({
    name: String,
    password: String,
    home: Boolean,
    article: Boolean,
    client: Boolean,
    vendor: Boolean,
    statistique: Boolean,
    account: Boolean


});




//mongoDB Model 

const user_model = mongoose.model('user', user_schema);


//exports

exports.user_model = user_model;
