const mongoose = require('mongoose');

//mongoDB schema
const product_schema = new mongoose.Schema({
    id: Number,
    name: String,
    price: Number,
    net_profit: Number,
    quantity: Number,
    category: String,
    code: Number
    

});

product_schema.index({ name: 'text' });
/*
const sub_code_schema = new mongoose.Schema({
    
    sub_code: Number,
    pro: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products'
    },


});
*/


//mongoDB Model 

const product_model = mongoose.model('products', product_schema);
//const sub_code_model = mongoose.model('sub_code', sub_code_schema);

//exports

exports.product_model = product_model;
//exports.sub_code_model = sub_code_model;