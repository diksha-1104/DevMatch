const express = require('express');
const authRouter=express.Router();

const User = require('../models/user');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const validator = require('validator');
const {validateSignUpData} = require('../utils/validation');
const {authUser} = require('../middleware/auth');
require('dotenv').config();

authRouter.use(cookieParser());

authRouter.post('/signup',async (req,res)=> {
    try{
        validateSignUpData(req);
        const { firstName, lastName, emailId, password } = req.body;
        const hashedPassword=await bcrypt.hash(password,10);
        const users=new User({
            firstName,lastName,emailId,password:hashedPassword
        });
       const savedUser=await users.save();

        const token=await savedUser.getJWT();
        res.cookie('token', token, { httpOnly: true }, {expires : new Date(Date.now() + 24 * 3600000)}); // 24 hour expiration
            
       res.json({message:'User created successfully!',data:savedUser});
    }
    catch(err){
        res.status(400).send('Error creating user: ' + err.message);
    }
});

authRouter.post('/login',async(req,res)=>{
    try{
        const {emailId,password}=req.body;
        if(!emailId || !password){
            throw new Error('Missing required fields');
        }
        if(!validator.isEmail(emailId)){
            throw new Error('Invalid email format');
        }
        const user=await User.findOne({emailId: emailId});
        if(!user){
            throw new Error('User not found');
        }
        const isPasswordValid=await user.validatePassword(password);
        if(isPasswordValid){
            const token=await user.getJWT();
            res.cookie('token', token, { httpOnly: true }, {expires : new Date(Date.now() + 3600000)}); // 1 hour expiration
            res.send(user);
        }
        else{
            throw new Error('Invalid Credentials');
        }

    }
    catch(err){
        res.status(400).send('Error logging in: ' + err.message);
    }
});

authRouter.post('/logout',async(req,res)=>{
        //res.clearCookie('token');
        res.cookie('token',null,{expires: new Date(Date.now())});
        res.send('Logout successful');
});


module.exports=authRouter;