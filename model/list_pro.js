const mongoose = require('mongoose');

//mongoDB schema
const list_pro_schema = new mongoose.Schema({
    id: Number,
    name: String,
    price: Number,
    price_of_buy: Number,
    quantity: Number,
    code: Number,
    id2: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'products'
},


});

//mongoDB Model 

const list_pro_model = mongoose.model('list_pro', list_pro_schema);

//exports

exports.list_pro_model = list_pro_model;