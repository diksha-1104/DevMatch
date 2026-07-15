const User=require('../models/user');
const jwt=require('jsonwebtoken');
const authUser=async(req,res,next)=>{
    try{
        const {token}=req.cookies;
        if(!token){
            return res.status(401).send("Please Login!");
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        const user=await User.findById(decoded._id);
        if(!user){
            throw new Error("User not found");
        }
        req.user=user;
        next(); 
    }
    catch(err){
        res.status(401).send('Authentication failed: ' + err.message);
    }   
}
module.exports={authUser};