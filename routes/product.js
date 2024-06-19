'use strict';
var express = require('express');
var router = express.Router();
const { product_model } = require('../model/product');
const { client_model } = require('../model/clientAndVendor');
const { vendor_model } = require('../model/clientAndVendor');
const { transaction_model } = require('../model/transactions');





/* GET product list. */
router.get('/', async function (req, res) {
    
    if (req.cookies.login ) {

        if (req.cookies.article == "true") {
            if (req.query.product) {
                var data_one_p = await product_model.findById(req.query.product);
                var id = data_one_p._id;
            }
            else {
                var data_one_p = 0;
                var id = 0;
            }
            if (req.query.search) {

                var pro = await product_model.find({ name: { $regex: req.query.search } })
                if (pro.length == 0) {
                    var pro = await product_model.find({ code: req.query.search})
                }

            }
            else if (req.query.filter == "price") {

                var pro = await product_model.find()
                    .sort({ price: -1 });
                //.populate("category", "name");
            }
            else if (req.query.filter == "quantity") {

                var pro = await product_model.find()
                    .sort({ quantity: 1 });
                // .populate("category", "name");
            }
            else if (req.query.filter == "category") {

                var pro = await product_model.find()
                    .sort({ category: 1 });
                //.populate("category", "name");
            }
            else if (req.query.cat) {

                var pro = await product_model.find({ category: req.query.cat });
                //.populate("category", "name");
            } else {

                var pro = await product_model.find();
                //.populate("category", "name");
            }

            //const cat = await category_model.find();

            res.render('product/Article', { product: pro, data: data_one_p, id: id });
        } else {
            res.send('<script>alert("You do not have permission to enter here")</script>');
        }
    } else {
        res.redirect('/user/login');
    }
  
});



// post add product and update 
router.post('/', async function (req, res) {
    if (req.body.id == 0) {
        const data = new product_model({
            code: req.body.code,
            name: req.body.name,
            price: req.body.price,
            net_profit: req.body.profit,
            quantity: req.body.quantity,
            category: req.body.category
        });

        try {
            await data.save();
            const data2 = new transaction_model({
                profit: -1 * (req.body.price * req.body.quantity),
                price: -1 * (req.body.price * req.body.quantity),
                type: "buy"
            });

            await data2.save();
            res.redirect('/')

        }
        catch (err) {
            res.send("error , The data has not been added");
            res.send(err);
        }
    }
    else {
        const prod = await product_model.findById(req.body.id);
        var qantity = req.body.quantity - prod.quantity;
        if (qantity > 0) {
            const data3 = new transaction_model({
                profit: -1 * (req.body.price * qantity),
                price: -1 * (req.body.price * qantity),
                type: "buy"
            });

            await data3.save();
        }
        try{
        const find = await product_model.findByIdAndUpdate(
            req.body.id,
            {
                code: req.body.code,
                name: req.body.name,
                price: req.body.price,
                net_profit: req.body.profit,
                quantity: req.body.quantity,
                category: req.body.category,
            },
            function (err, docs) {
                if (err) {

                    res.send("error ")
                }
                else {
                    
                    res.redirect("/" );
                }
            });
        }catch(e){
            console.log(e);
        }

    }
    
});

// GET notification page
router.get('/notification', async function (req, res) {
    const data1 = await product_model.find({ quantity: { $lt: 5,$gt : 0 } });
    const data2 = await product_model.find({ quantity: 0 });
    res.render('product/notif', { pro1: data1, pro2: data2 });
});


// POST delete product
router.post("/delete/:ID", async function (req, res) {
    if (req.params.ID === "favicon.ico") {
        return res.status(404)
    }
    if (req.params.ID != 0) {
        try{
        const find = await product_model.findByIdAndRemove(
            req.params.ID,
            function (err, docs) {
                if (err) {
                    res.send(err)
                }
                else {
                    res.redirect("/");
                }
            });

    }catch(e){
        console.log(e);
    }
}

    else {
        res.redirect("/");
    }

    
});


//get client page
router.get('/client', async function (req, res) {
    if (req.cookies.login) {
        if (req.cookies.client) {
            const data1 = await client_model.find();
            if (req.query.client) {
                var data_one_c = await client_model.findById(req.query.client);
                var id = data_one_c._id;
            }
            else {
                var data_one_c = 0;
                var id = 0;
            }
            res.render('cl_ve/client', { pro: data1, data: data_one_c, id: id });
        } else {
            res.send('<script>alert("You do not have permission to enter here")</script>');
        }

    } else {
        res.redirect('/user/login')
    }
});

// post add client and update 
router.post('/client', async function (req, res) {
    if (req.body.id == 0) {
        const data = new client_model({
            
            name: req.body.name,
            total_price: req.body.total_price,
            paid: req.body.paid,
            phone: req.body.phone,
            email: req.body.email,
            profit:0
        });

        try {
            await data.save();
            res.redirect('/client')
        }
        catch (err) {
            res.send("error , The data has not been added");
            res.send(err);
        }
    }
    else {
        const total_price = await client_model.findById(req.body.id);
        if (total_price.total_price == req.body.paid) {
            const data = new transaction_model({
                profit: total_price.profit,
                price: total_price.total_price,
                type: "sell"
            });

            await data.save();
            try{
            const find = await client_model.findByIdAndUpdate(
                req.body.id,
                {
                    name: req.body.name,
                    total_price:0,
                    paid: 0,
                    phone: req.body.phone,
                    email: req.body.email,

                },
                function (err, docs) {
                    if (err) {

                        res.send("error ")
                    }
                    else {

                        res.redirect("/client");
                    }
                });
            }catch(e)
            {
                return e;
            }
        } else {
            try{
            const find = await client_model.findByIdAndUpdate(
                req.body.id,
                {
                    name: req.body.name,

                    paid: req.body.paid,
                    phone: req.body.phone,
                    email: req.body.email,

                },
                function (err, docs) {
                    if (err) {

                        res.send("error ")
                    }
                    else {

                        res.redirect("/client");
                    }
                });
            }catch(e){
                return e;
            }
        }
            
        
    }

});

// POST delete client
router.post("/delete_client/:ID", async function (req, res) {
    if (req.params.ID === "favicon.ico") {
        return res.status(404)
    }
    if (req.params.ID != 0) {
        try{
        const find = await client_model.findByIdAndRemove(
            req.params.ID,
            function (err, docs) {
                if (err) {
                    res.send(err)
                }
                else {
                    res.redirect("/client");
                }
            });
        }catch(e){
            return e;
        }

        }
    else {
        res.redirect("/client");
    }

});








//get vendor page
router.get('/vendor', async function (req, res) {
    if (req.cookies.login) {
        if (req.cookies.vendor == "true") {
            const data1 = await vendor_model.find();
            if (req.query.vendor) {
                var data_one_c = await vendor_model.findById(req.query.vendor);
                var id = data_one_c._id;
            }
            else {
                var data_one_c = 0;
                var id = 0;
            }
            res.render('cl_ve/vendor', { pro: data1, data: data_one_c, id: id });
        } else {
            res.send('<script>alert("You do not have permission to enter here")</script>');
        }
    } else {
        res.redirect('/user/login');
    }
});

// post add vendor and update 
router.post('/vendor', async function (req, res) {
    if (req.body.id == 0) {
        const data = new vendor_model({

            name: req.body.name,
            phone: req.body.phone,
            email: req.body.email,
           
        });

        try {
            await data.save();
            res.redirect('/vendor')
        }
        catch (err) {
            res.send("error , The data has not been added");
            res.send(err);
        }
    }
    else {
        try{
        const find = await vendor_model.findByIdAndUpdate(
            req.body.id,
            {
                name: req.body.name,

                phone: req.body.phone,
                email: req.body.email,

            },
            function (err, docs) {
                if (err) {

                    res.send("error ")
                }
                else {

                    res.redirect("/vendor");
                }
            });
        }catch(e){
                return e
            }
    }

});

// POST delete vendor
router.post("/delete_vendor/:ID", async function (req, res) {
    if (req.params.ID === "favicon.ico") {
        return res.status(404)
    }
    if (req.params.ID != 0) {
        try{
        const find = await vendor_model.findByIdAndRemove(
            req.params.ID,
            function (err, docs) {
                if (err) {
                    res.send(err)
                }
                else {
                    res.redirect("/vendor");
                }
            });
        }catch(e){
            return e
        }

    }
    else {
        res.redirect("/vendor");
    }

});



router.get('/api/get_json', async function (req, res) {

    const data = await product_model.find();
    res.send(data);
})



// export
module.exports = router;
