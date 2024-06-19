'use strict';
var express = require('express');
var router = express.Router();
const { product_model } = require('../model/product');
const { transaction_model } = require('../model/transactions');



//get statistique page
router.get('/stat', async function (req, res) {
    if (req.cookies.login) {
        if (req.cookies.statistique == "true") {

            var d_profit = 0;
            var m_profit = 0;
            var ras_el_mal = 0;
            var coffre = 0;
            var days_profit = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
            var months_profit = [0,0,0,0,0,0,0,0,0,0,0,0];
            

             
            const all_product = await product_model.find();
            for (let i = 0; i < all_product.length; i++) {
                ras_el_mal += (all_product[i].quantity * all_product[i].price);
            }

            const tran = await transaction_model.find();

            for (let j = 0; j < 30; j++) {
                for (let i = 0; i < tran.length; i++) {
                    var now2 = new Date().getDate();
                    var tran_date2 = new Date(tran[i].date.getDate());
                    
                    var distance2 = now2  - tran_date2;
                    
                    
                    

                    if (distance2 == j) {
                        days_profit[j] += tran[i].profit;
                    }
                }

            }

            for (let j = 0; j < 12; j++) {
                for (let i = 0; i < tran.length; i++) {
                    var now3 = new Date().getMonth();
                    var tran_date3 = new Date(tran[i].date.getMonth());
                    var distance3 = now3 - tran_date3;

                   

                    if (distance3 == j) {
                        months_profit[j] += tran[i].profit;
                    }
                }

            }
           
            
            for (let i = 0; i < tran.length; i++) {
                coffre += tran[i].profit;

                var d_now = new Date().getDate();
                var tran_date_d = new Date(tran[i].date.getDate());
                var m_now = new Date().getMonth();
                var tran_date_m = new Date(tran[i].date.getMonth());
                var distance_1 = d_now - tran_date_d;
                var distance_2 = m_now - tran_date_m;
                

                if (distance_2 == 0) {
                        m_profit += tran[i].profit;

                    if (distance_1 == 0) {
                            d_profit += tran[i].profit;
                        }

                    }
                

            }

            var etat_d = [];
            for (let i = 0; i < 30; i++) {
                if (days_profit[i] > days_profit[i + 1]) {
                    etat_d[i] = true;
                } else {
                    etat_d[i] = false;
                }
            }

            var etat_m = [];
            for (let i = 0; i < 12; i++) {
                if (months_profit[i] > months_profit[i + 1]) {
                    etat_m[i] = true;
                } else {
                    etat_m[i] = false;
                }
            }

            res.render('profit/stat', {
                r: ras_el_mal, d_p: d_profit,
                m_p: m_profit, c: coffre,
                ds_p: days_profit, ms_p: months_profit,
                etd: etat_d, etm: etat_m
                
            });

        } else {
            res.send('<script>alert("You do not have permission to enter here")</script>');
        }
    } else {
        res.redirect('/login')
    }
});

//export
module.exports = router;