var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var busboy = require('busboy');
var User = require('../models/User.js');
var fs = require('fs');
var Company = require('../models/Company.js');

module.exports = function(router) {

    router.get('/hello', function(req,res) {
        res.send('hello world');
    });

    router.post('/company', function(req, res) {
        var company = new Company();
        company.username = req.body.username;
        company.password = req.body.password;
        company.email = req.body.email;
        company.name = req.body.name;

        if(company.username == null || company.password == null || company.email == null || company.name == null) {
            res.json({error:"At least one of the parameters is empty"});
        }

        else {

            bcrypt.hash(company.password, null, null, function(err, hash) {
                if (err) return; // Exit if error is found
                company.password = hash; // Assign the hash to the user's password so it is saved in database encrypted
            });

            Company.find({name:company.name}, function(err, docs) {
                if(err || docs.length) {
                    res.json({error: "Company already exists"});
                }

                else {
                    company.save(company, function(err) {
                        if(err) {
                            res.json({error: "Failed to create account"});
                        }
        
                        res.json({success: "Company Account Successfully Created"});
                    });
                }
                
            });
            
        }
    });

    router.post('/users', function(req,res) {
        var user = new User();
        user.username = req.body.username;
        user.password = req.body.password;
        user.email = req.body.email;
        user.company = req.body.company;

        if(user.username == null || user.password == null || user.email == null || user.company == null) {
            res.json({error:"At least one of the parameters is empty"});
        }

        else {

            bcrypt.hash(user.password, null, null, function(err, hash) {
                if (err) return; // Exit if error is found
                user.password = hash; // Assign the hash to the user's password so it is saved in database encrypted
            });

            Company.find({name:user.company}, function(err, docs) {
                if(err || !docs.length) {
                    res.json({error: "Company does not exist"});
                }

                else {
                    User.find({username:req.body.username}, function(err, docs) {

                        if(err) {
                            res.json({error: "Failed to create account"});   
                        }
            
                        else if(docs.length) {
                            res.json({error:'Username already exists'});
                        }                
            
                        user.save(user, function(err) {
            
                            if(err) {
                                res.json({error: "Failed to create account"});
                            }

                            else {
                                Company.findOne({name:user.company}, function(err, company) {
                                    company.workers.push(user.username);
                                    Company.update({name: company.name}, company, function(err) {
                                        if(err) {
                                            console.log("hit");
                                            res.json({error: "Failed to create account"});
                                        }

                                        else {
                                            res.json({success: "User Account Successfully Created"});
                                        }
                                    });
                                });
                            }
            
                            
                        });

                    });
                }
            });
            
        }
    });

    router.post('/login', function(req,res) {
        var username = req.body.username;
        var password = req.body.password;

        if(username == null || password == null) {
            res.json({error: "Atleast one field missing"});
        }

        else {

            User.findOne({username:username}, function(err,user) {
                console.log(user);
                if(user) {
                    bcrypt.compare(password, user.password, function(err,result) {
                        if(result == true) {
                            res.json({success:"User Autheniticated"});
                        }

                        else {
                            res.json({error:"Invalid Password"});
                        }

                    });
                }

                else {
                    res.json({error:"Invalid username or password"});
                }
            });

        }
    });
    
    router.post('/uploadImage', function(req,res) {

        fs.writeFile("./public/images/" + Date.now() +  ".jpg", Buffer(req.files.car.data,'base64'), function(err) {
            if(err) {
                console.log(err);
            }

            else {
                res.send("Thanks");
            }
        });

    });

    return router;
}