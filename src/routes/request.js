const express=require('express');
const requestRouter=express.Router();

const {authUser} = require('../middleware/auth');
const User=require('../models/user');
const ConnectionRequest=require('../models/connectionRequest');

requestRouter.post('/request/send/:status/:toUserId',authUser,async(req,res)=>{
    try{
        const fromUserId=req.user._id;
        const toUserId=req.params.toUserId;
        const status=req.params.status;

        const allowedStatus=['ignored','interested'];
        if(!allowedStatus.includes(status)){
            return res.status(400).send({message:'Invalid status. Allowed values are ignored or interested'});
        }

        const toUser=await User.findById(toUserId);
        if(!toUser){
            return res.status(404).send({message:'User not found'});
        }

        const existingRequest=await ConnectionRequest.findOne({
            $or: [
                { fromUserId: fromUserId, toUserId: toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });
        if(existingRequest){
            return res.status(400).send({message:'Connection request already exists'});
        }

        const connectionRequest=new ConnectionRequest({
            fromUserId,
            toUserId: toUserId,
            status
        });
        const data=await connectionRequest.save();
        res.json({message:req.user.firstName+ " has sent a " + status + " request to " + toUser.firstName, connectionRequest:data});
    }
    catch(err){
        res.status(400).send('Error sending connection request: ' + err.message);
    }
});

requestRouter.post('/request/review/:status/:requestID',authUser,async(req,res)=>{
    try{
        const loggedInUser=req.user;
        const {status, requestID}=req.params;

        const allowedStatus=['accepted','rejected'];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message:'Invalid status'});
        }

        const connectionRequest=await ConnectionRequest.findOne({
            _id: requestID,
            toUserId: loggedInUser._id,
            status: 'interested'
        });
        if(!connectionRequest){
            return res.status(404).json({message:'No pending connection request found for this user'});
        }   
        connectionRequest.status=status;
        const data=await connectionRequest.save();
        res.json({message:'Connection request has been ' + status ,data});

    }
    catch(err){
        res.status(400).send('Error reviewing connection request: ' + err.message);
    }
});

module.exports=requestRouter;
