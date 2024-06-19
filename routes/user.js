'use strict';
var express = require('express');
var router = express.Router();

const { user_model } = require('../model/user');




//get user page
router.get('/', async function (req, res) {
    if (req.cookies.login) {
        if (req.cookies.account == "true") {
            const data1 = await user_model.find();
            if (req.query.user) {
                var data_one_c = await user_model.findById(req.query.user);
                var id = data_one_c._id;
            }
            else {
                var data_one_c = 0;
                var id = 0;
            }
            res.render('user/user', { pro: data1, data: data_one_c, id: id });
        }
        else {
            res.send('<script>alert("You do not have permission to enter here")</script>');
        }
    } else {
        res.redirect('/login');
    }
   
});

// post add user and update 
router.post('/', async function (req, res) {

    if (req.body.home) {
        var home = req.body.home
    }
    else {
        var home = 0;
    }
    if (req.body.article) {
        var article = req.body.article
    }
    else {
        var article = 0;
    }
    if (req.body.client) {
        var client = req.body.client
    }
    else {
        var client = 0;
    }
    if (req.body.vendor) {
        var vendor = req.body.vendor
    }
    else {
        var vendor = 0;
    }
    if (req.body.account) {
        var account = req.body.account
    }
    else {
        var account = 0;
    }
    if (req.body.stat) {
        var stat = req.body.stat
    }
    else {
        var stat = 0;
    }
    if (req.body.id == 0) {
        
        const data = new user_model({

            name: req.body.name,
            password: req.body.password,
            home: home,
            article: article,
            client: client,
            vendor: vendor,
            statistique: stat,
            account: account

        });

        try {
            await data.save();
            res.redirect('/user')
        }
        catch (err) {
            res.send("error , The data has not been added");
            res.send(err);
        }
    }
    else {
        try{
        const find = await user_model.findByIdAndUpdate(
            req.body.id,
            {
                name: req.body.name,
                password: req.body.password,
                home: home,
                article: article,
                client: client,
                vendor: vendor,
                statistique: stat,
                account: account

            },
            function (err, docs) {
                if (err) {

                    res.send("error ")
                }
                else {

                    res.redirect("/user");
                }
            });
        }catch{
            return "error";
        }
    }

});

// POST delete user
router.post("/delete_user/:ID", async function (req, res) {
    if (req.params.ID === "favicon.ico") {
        return res.status(404)
    }
    if (req.params.ID != 0) {
        try{
        const find = await user_model.findByIdAndRemove(
            req.params.ID,
            function (err, docs) {
                if (err) {
                    res.send(err)
                }
                else {
                    res.redirect("/user");
                }
            });
        }catch(e){
            return e
        }

    }
    else {
        res.redirect("/user");
    }

});



// GET login page
router.get('/login', async function (req, res) {
    
    res.render('user/AdminPanel');

});

// post login page
router.post('/login', async function (req, res) {

    try {
        const user = await user_model.find({ name: req.body.name, password: req.body.password });
        console.log(user);
        res.cookie(`login`, 'true');
        res.cookie(`statistique`, user[0].home);
        res.cookie(`article`, user[0].article);
        res.cookie(`client`, user[0].client);
        res.cookie(`vendor`, user[0].vendor);
        res.cookie(`account`, user[0].account);
        res.redirect('/home')
         
    } catch (err) {
        //res.send(err)
        res.redirect('/login?p=not login');
        
    }

    res.render('user/login');
});

// deconexion
router.get('/dec', async function (req, res) {

    res.clearCookie('login');
    res.redirect('/login');

});






  



// export
module.exports = router;
