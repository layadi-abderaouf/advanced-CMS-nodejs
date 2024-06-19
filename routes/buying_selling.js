'use strict';
// import model from database
var express = require('express');
var router = express.Router();
const { product_model } = require('../model/product');
//const { sub_code_model } = require('../model/product');
const { transaction_model } = require('../model/transactions');
const { list_pro_model } = require('../model/list_pro');
const { client_model } = require('../model/clientAndVendor');


/* GET home page */
router.get('/', async function (req, res) {
    if (req.cookies.login) {

        const data = await list_pro_model.find();
        if (req.query.add) {
            //const sub_code = await sub_code_model.find({ sub_code: parseInt(req.query.add) })
        
            
            var product = await product_model.find({code : parseInt(req.query.add)});
            product = product[0]
          
            const add_pro = new list_pro_model({
                id2: product._id,
                code: product.code,
                name: product.name,
                price: product.price,
                price_of_buy: product.net_profit,
                quantity: product.quantity,

            });
            console.log(product._id)
            try {
                await add_pro.save();
                res.redirect('/home')
            }
            catch (err) {
                res.send("error , The data has not been added");
                res.send(err);
            }
        }
        var total_price = 0;

        for (let i = 0; i < data.length; i++) {
            total_price += data[i].price_of_buy;

        }
        if (req.query.select) {
            var select = req.query.select;
        }
        else {
            var select = 0;
        }
        const client = await client_model.find();
        const not1 = await product_model.find({ quantity: { $lt: 5, $gt: 0 } });
        const not2 = await product_model.find({ quantity: 0 });
        const l = not1.length + not2.length
        res.render('buysell/home', { product: data, total_price: total_price, select: select, clients: client, n1: not1, n2: not2 ,l:l});
    } else {
        res.redirect('/user/login')
    }
    
});



router.get('/delete_all_list', async function (req, res) {
    list_pro_model.remove().exec();
    res.redirect('/home');
});



//POST sell page 

router.get('/sell', async function (req, res) {
    const list_pro = await list_pro_model.find();

    for (let i = 0; i < list_pro.length; i++) {

        const data = new transaction_model({
            product: list_pro[i].id2,
            quantity: list_pro[i].quantity,
            price: list_pro[i].price_of_buy ,
            profit: (list_pro[i].price_of_buy - list_pro[i].price) ,
            type: "sell"
        });

        await data.save();

        const product = await product_model.findById(list_pro[i].id2);
        let q = parseInt(product.quantity) - 1;

        const find = await product_model.findByIdAndUpdate(
            list_pro[i].id2,
            {
                quantity: q,
            }
        )
    }
    list_pro_model.remove().exec();


    res.redirect('/home');
    
    
});

//get add payment
router.get('/pay', async function (req, res) {
    if (req.query.montant != 0) {
        const data = new transaction_model({

            quantity: 1,
            price: req.query.montant,
            profit: req.query.montant,
            type: "payment"
        });

        await data.save();
        res.redirect('/home');
    } else {
        res.redirect('/home');
    }

});

//get add retrait
router.get('/retrait', async function (req, res) {
    if (req.query.montant != 0) {
        const data = new transaction_model({

            quantity: 1,
            price: req.query.montant,
            profit: -1 * req.query.montant,
            type: "retrait"
        });

        await data.save();
        res.redirect('/home');
    } else {
        res.redirect('/home');
    }
    
});

//update price
router.get('/update', async function (req, res) {
    try{
    const find = await list_pro_model.findByIdAndUpdate(
        req.query.select,
        {
            price_of_buy: req.query.montant
        },
        function (err, docs) {
            if (err) {

                res.send("error ")
            }
            else {

                res.redirect("/home");
            }

        });
    }catch(e){
        return e;
    }

});

//add credit
router.get('/credit', async function (req, res) {

    
    if (req.query.select != 0) {
        const data = await list_pro_model.findById(req.query.select);
        const product = await product_model.findById(data.id2._id);
        const qq = product.quantity - 1;



     
        try{
        const find = await client_model.findByIdAndUpdate(
            req.query.client,
            {
                total_price: data.price_of_buy,
                profit: data.price_of_buy - data.price
            },
            function (err, docs) {
                if (err) {

                    res.send("error ")
                }
                else {

                    res.redirect('delete_one/?id=' + req.query.select + "&p=" + data.id2._id + "&q=" + qq);

                }
            });
        }catch(e){
            return e
        }
        
    }
    else {
        res.redirect('/home')
    }
    
});

//  delete one product of list_pro
router.get("/delete_one/", async function (req, res) {
    
    try{
    const find = await list_pro_model.findByIdAndRemove(
        req.query.id,
        function (err, docs) {
            if (err) {
                res.send(err)
            }
            else {
                res.redirect("/home/mains_q?p=" + req.query.p + "&q=" + req.query.q)
            }
        });
    }catch(e){
        return e
    }
});

router.get("/mains_q/", async function (req, res) {
    try{
    const find = await product_model.findByIdAndUpdate(
        req.query.p,
        {
            quantity: req.query.q
        },
        function (err, docs) {
            if (err) {

                res.send("error ")
            }
            else {

                res.redirect("/home");

            }
        });
    }catch(e){
        return e
    }
    
});

//export
module.exports = router;