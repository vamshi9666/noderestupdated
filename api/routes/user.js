const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

router.post('/signup',(req,res,next)=>{
    User.find({email: req.body.email})
    .exec()
    .then(user =>{
        if(user.length>=1){
            return res.status(409).json({
                message: "mail already exists"
            });
        }
        else{
            bcrypt.hash(req.body.password,10,(err,hash)=>{
                if(err){
                     return res.status(500).json({
                         error: err
                     });
                }    
                 else {
                    const user = new User({
                        _id: mongoose.Types.ObjectId(),
                        email: req.body.email,
                       password: hash     //hashing password with 10 rounds of added salt
                    });
                    user
                    .save()
                    .then(result =>{
                        console.log(result);
                        res.status(201).json({
                            message: 'User created '
                        });
                    })
                    .catch(err =>{
                        console.log(err);
                    res.status(500).json({error: err});
                    });
                 }    
            })
        }

    })
   
     
   
});
router.post('/login',(req,res,next)=> {
    User.find({email: req.body.email})
    .exec()
    .then(user =>{
        if(user.length<1){
            return res.status(401).json({
                message: 'Authentication failed'
            });
        }
        bcrypt.compare(req.body.password, user[0].password,(err,result)=>{
            if(err){
                return res.status(401).json({
                    message: 'Authentication failed'
                });
            }
            if(result){
               const token= jwt.sign({
                    email: user[0].email,
                    usrId: user[0]._id
                },
                "Afour",
                {
                    expiresIn: "1h"
                }

                );
                return res.status(200).json({
                    message: "Authorized user",
                    token: token
                });

            }
            return res.status(401).json({
                message: 'Authentication failed' });
        });
    })
    .catch(err =>{
        console.log(err);
    res.status(500).json({error: err});
    });
});
router.delete('/:userId',(req,res,next)=>{
    User.remove({_id:req.params.userId})
    .exec()
    .then(result=>{
        res.status(200).json({
            message: "user deleted"
        });
    })
    .catch(err =>{
        console.log(err);
    res.status(500).json({error: err});
    });
});

module.exports = router;