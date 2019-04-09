var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var busboy = require('busboy');
var User = require('../models/User.js');
var fs = require('fs');
var Company = require('../models/Company.js');
var Workflow = require('../models/Workflow.js');
var emailService = require('../services/EmailService.js');

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

    router.post('/getUser', function(req, res) {

        let username = req.body.username;
        User.findOne({username:username}, function(err, user) {
            if(err) {
                res.json({error: "Could not find user"});
            }

            else {
                res.json({user:user});
            }
        });

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
                                console.log(err);
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

    router.post('/requestWorkflow', function(req,res) {
        // find available workflow
        // send workflow to client. Make sure to include unique ID: $oid

        let company = req.body.company;

        Workflow.find({company: company, state:"Open"}, function(err, workflows) {
            if(workflows.length > 0) {
                let workflow = workflows[0];
                workflow.state = "IP"; // IP = In Progress

                let img = fs.readFileSync(workflow.imageURL);

                res.writeHead(200, {'Content-Type': 'image/gif' });
                res.end(img, 'binary');

                workflow.state = "IP";
                let email = {
                    from: 'Towing Cucks, towingcucks@zoho.com',
                    to: 'alexpopeil23@gmail.com',
                    subject: 'Workflow Requested',
                    text: 'Hello cuck, we found an eligible car to be towed!',
                    attachments: [{
                        filename: 'Logo.png',
                        path: workflow.imageURL,
                        cid: 'car' 
                   }],
                    html: 'Hello cuck, we found an eligible car to be towed!<br><br><img src="cid:car">'
                };
                emailService.send_email(email);
                workflow.update(workflow, function(err) {
                    if(err) {
                        console.log(err);
                    }
                });
            }

            else {
                res.json({error: "No Available Workflows"});
            }
        });
    });

    router.post('/workflow', function(req, res) {
        let company = req.body.company;
        console.log(req.body);
        // update below so it can query in progress workflows
        Workflow.find({company:company, state:["Open", "IP"]}, function(err, openWorkflows){
            if(err) {
                res.json({error: "No Open Workflows"});
            }

            else {
                res.json({openWorkflows:openWorkflows});
            }
        });
    });
    
    router.post('/addWorkflow', function(req,res) {
        console.log(req);
        let workflow = new Workflow();

        workflow.parkingLot = req.body.parkingLot;
        workflow.date = req.body.date;
        workflow.location = req.body.location;
        workflow.company = req.body.company;
        workflow.state = "Open";
        let date_now = Date.now();
        console.log(workflow.company);
        let filePath = "./public/images/" + date_now +  ".jpg";
        workflow.imageURL = filePath;

        fs.writeFile(filePath, Buffer(req.files.car.data,'base64'), function(err) {
            if(err) {
                console.log(err);
                res.json({error: "Could not save Workflow"});
            }

            else {
                workflow.save(workflow, function(err) {
                    if(err) {
                        console.log(err);
                        res.json({error: "Could not save Workflow"});
                    }

                    else {
                        res.json({success: "Workflow Saved"});
                    }
                });
            }
        });

    });

    router.post('/closeWorkflow', function(req,res) {
        let id = req.body.id;
        console.log(id);
        Workflow.findById(id, function(err, workflow) {
            if(err) {
                res.json({error: "could not find workflow"});
            }

            else {
                workflow.state = "Closed";
                workflow.update(workflow, function(err) {
                    if(err) {
                        res.json({error: "workflow could not be close, try again later"});
                    }
                })
                res.json({success: "workflow closed"});
            }
        });
    });

    router.post('/startWorkflow', function(req, res) {

        let id = req.body.id;

        Workflow.findById(id, function(err, workflow) {
            if(err) {
                res.json({error: "could not find workflow"});
            }

            else {
                workflow.state = "IP";
                workflow.update(workflow, function(err) {
                    if(err) {
                        res.json({error: "workflow could not be started, try again later"});
                    }
                })
                res.json({success: "workflow started"});
            }
        });

    });

    return router;
}