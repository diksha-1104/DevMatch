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
        }).populate('fromUserId','firstName lastName age gender about skills photoUrl');
        res.json({ connectionRequests });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const USER_SAFE_DATA="firstName lastName age gender about skills photoUrl";

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
// ======================================================
// GET AVAILABLE SKILLS
// ======================================================
//
// IMPORTANT:
// Skills come directly from MongoDB.
// Nothing is hardcoded here.
// ======================================================

userRouter.get(
    '/user/skills',
    authUser,
    async (req, res) => {

        try {

            const skills = await User.distinct(
                'skills'
            );


            const cleanedSkills =
                skills
                    .filter(
                        (skill) =>
                            typeof skill === 'string'
                    )
                    .map(
                        (skill) =>
                            skill.trim()
                    )
                    .filter(
                        (skill) =>
                            skill.length > 0
                    )
                    .sort(
                        (a, b) =>
                            a.localeCompare(
                                b
                            )
                    );


            res.json({
                skills: cleanedSkills
            });

        } catch (error) {

            console.error(
                'Error fetching skills:',
                error
            );

            res.status(500).json({
                message:
                    'Error fetching skills'
            });

        }
    }
);


// ======================================================
// SEARCH DEVELOPERS
// ======================================================

userRouter.get(
    '/user/search',
    authUser,
    async (req, res) => {

        try {

            const loggedInUser = req.user;


            const searchQuery =
                req.query.query?.trim() || '';


            const selectedSkill =
                req.query.skill?.trim() || '';


            // ------------------------------------------
            // BUILD SEARCH CONDITIONS
            // ------------------------------------------

            const searchConditions = {

                _id: {
                    $ne: loggedInUser._id
                }

            };


            // ------------------------------------------
            // TEXT SEARCH
            // ------------------------------------------

            if (searchQuery) {

                searchConditions.$or = [

                    {
                        firstName: {
                            $regex: searchQuery,
                            $options: 'i'
                        }
                    },

                    {
                        lastName: {
                            $regex: searchQuery,
                            $options: 'i'
                        }
                    },

                    {
                        skills: {
                            $regex: searchQuery,
                            $options: 'i'
                        }
                    },

                    {
                        about: {
                            $regex: searchQuery,
                            $options: 'i'
                        }
                    }

                ];

            }


            // ------------------------------------------
            // SKILL FILTER
            // ------------------------------------------

            if (selectedSkill) {

                searchConditions.skills = {
                    $regex: `^${selectedSkill}$`,
                    $options: 'i'
                };

            }


            // ------------------------------------------
            // FIND USERS
            // ------------------------------------------

            const users = await User.find(
                searchConditions
            )
                .select(USER_SAFE_DATA)
                .limit(20);


            // ------------------------------------------
            // GET RELATIONSHIPS
            // ------------------------------------------

            const relationships =
                await ConnectionRequest.find({

                    $or: [

                        {
                            fromUserId:
                                loggedInUser._id
                        },

                        {
                            toUserId:
                                loggedInUser._id
                        }

                    ]

                });


            // ------------------------------------------
            // RELATIONSHIP MAP
            // ------------------------------------------

            const relationshipMap =
                new Map();


            relationships.forEach(
                (request) => {

                    const otherUserId =
                        String(
                            request.fromUserId
                        ) ===
                        String(
                            loggedInUser._id
                        )
                            ? String(
                                request.toUserId
                            )
                            : String(
                                request.fromUserId
                            );


                    let status = "none";


                    // ------------------------------
                    // ACCEPTED
                    // ------------------------------

                    if (
                        request.status ===
                        "accepted"
                    ) {

                        status =
                            "connected";

                    }


                    // ------------------------------
                    // PENDING
                    // ------------------------------

                    else if (
                        request.status ===
                        "interested"
                    ) {

                        if (
                            String(
                                request.fromUserId
                            ) ===
                            String(
                                loggedInUser._id
                            )
                        ) {

                            status =
                                "pending";

                        }

                    }


                    relationshipMap.set(
                        otherUserId,
                        status
                    );

                }
            );


            // ------------------------------------------
            // ADD CONNECTION STATUS
            // ------------------------------------------

            const usersWithStatus =
                users.map((user) => {

                    const connectionStatus =
                        relationshipMap.get(
                            String(user._id)
                        ) || "none";


                    return {

                        ...user.toObject(),

                        connectionStatus

                    };

                });


            res.json({

                users:
                    usersWithStatus

            });


        } catch (error) {

            console.error(
                "Error searching developers:",
                error
            );


            res.status(500).json({

                message:
                    "Error searching developers"

            });

        }
    }
);

// ==========================================
// GET USER BY ID
// Used by Chat header
// ==========================================

userRouter.get(
    '/user/profile/:userId',
    authUser,
    async (req, res) => {
        try {

            const { userId } = req.params;

            const user = await User.findById(userId).select(
                'firstName lastName age gender about skills photoUrl'
            );

            if (!user) {
                return res.status(404).json({
                    message: 'User not found'
                });
            }

            res.json(user);

        } catch (error) {

            console.error(
                'Error fetching user:',
                error
            );

            res.status(500).json({
                message: 'Error fetching user'
            });
        }
    }
);

module.exports=userRouter;