const express=require('express');
const userRouter=express.Router();
const {authUser} = require('../middleware/auth');
const User=require('../models/user');
const ConnectionRequest=require('../models/connectionRequest');

userRouter.get('/user/requests/received',authUser,async(req,res)=>{
    try{
        const loggedInUser=req.user;
        const connectionRequests=await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: 'interested'
        }).populate('fromUserId','firstName lastName');
        res.json({ connectionRequests });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const USER_SAFE_DATA="firstName lastName age gender profilePicture";

userRouter.get('/user/connections',authUser,async(req,res)=>{
    try{
        const loggedInUser=req.user;
        const acceptedRequests=await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id, status: 'accepted' },

                { toUserId: loggedInUser._id, status: 'accepted' }
            ]
        }).populate('fromUserId toUserId', USER_SAFE_DATA);
        const data=acceptedRequests.map((row)=> {
            if(row.fromUserId._id.equals(loggedInUser._id)){
                return row.toUserId;
            } else {
                return row.fromUserId;
            }
        });
        res.json({ data});
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});

userRouter.get('/feed',authUser,async(req,res)=>{
    try{
        const loggedInUser=req.user;

        const page=parseInt(req.query.page) || 1;
        let limit=parseInt(req.query.limit) || 10;
        limit=Math.min(limit,100);
        const skip=(page-1)*limit;
        
        const connectionRequests=await ConnectionRequest.find({
            $or:[{fromUserId: loggedInUser._id},{toUserId: loggedInUser._id}],
        }).select('fromUserId toUserId');

        const hideUsersFromFeed=new Set();
        connectionRequests.forEach((req)=>{
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        });

        const users=await User.find({
            $and:[
                { _id: { $nin: Array.from(hideUsersFromFeed) } },
                { _id: { $ne: loggedInUser._id } },
            ],
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);

        res.send({ users });
    }
    catch(err){
        res.status(500).json({ error: err.message });
    }
});

module.exports=userRouter;