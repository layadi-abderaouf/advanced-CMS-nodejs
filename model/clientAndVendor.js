const mongoose = require('mongoose');


//mongoDB schema
const client_schema = new mongoose.Schema({
    name: String,
    phone: Number,
    email: String,
    paid: Number,
    total_price: Number,
    profit: Number


});

const vendor_schema = new mongoose.Schema({
    name: String,
    phone: Number,
    email: String,


});


//mongoDB Model 

const client_model = mongoose.model('client', client_schema);
const vendor_model = mongoose.model('vendor', vendor_schema);

//exports

exports.client_model = client_model;
exports.vendor_model = vendor_model;