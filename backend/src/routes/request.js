const express = require("express");

const requestRouter =
    express.Router();

const {
    authUser,
} = require("../middleware/auth");

const User =
    require("../models/user");

const ConnectionRequest =
    require("../models/connectionRequest");

const Notification =
    require("../models/notification");


requestRouter.post(
    "/request/send/:status/:toUserId",
    authUser,
    async (req, res) => {

        try {

            const fromUserId =
                req.user._id;

            const toUserId =
                req.params.toUserId;

            const status =
                req.params.status;


            // ======================================
            // VALIDATION
            // ======================================

            const allowedStatus = [
                "ignored",
                "interested",
            ];


            if (
                !allowedStatus.includes(
                    status
                )
            ) {

                return res.status(400).json({
                    message:
                        "Invalid status. Allowed values are ignored or interested",
                });
            }


            // ======================================
            // CANNOT SEND TO YOURSELF
            // ======================================

            if (
                String(fromUserId) ===
                String(toUserId)
            ) {

                return res.status(400).json({
                    message:
                        "You cannot send a request to yourself",
                });
            }


            // ======================================
            // FIND TARGET USER
            // ======================================

            const toUser =
                await User.findById(
                    toUserId
                );


            if (!toUser) {

                return res.status(404).json({
                    message:
                        "User not found",
                });
            }


            // ======================================
            // EXISTING REQUEST
            // ======================================

            const existingRequest =
                await ConnectionRequest.findOne(
                    {
                        $or: [
                            {
                                fromUserId:
                                    fromUserId,

                                toUserId:
                                    toUserId,
                            },
                            {
                                fromUserId:
                                    toUserId,

                                toUserId:
                                    fromUserId,
                            },
                        ],

                        status: {
                            $in: [
                                "interested",
                                "accepted",
                            ],
                        },
                    }
                );


            if (existingRequest) {

                return res.status(400).json({
                    message:
                        "Connection request already exists",
                });
            }


            // ======================================
            // CREATE REQUEST
            // ======================================

            const connectionRequest =
                new ConnectionRequest({
                    fromUserId,
                    toUserId,
                    status,
                });


            const data =
                await connectionRequest.save();


            // ======================================
            // CREATE NOTIFICATION
            // ======================================

            if (
                status ===
                "interested"
            ) {

                const notification =
                    await Notification.create({
                        recipientId:
                            toUserId,

                        senderId:
                            fromUserId,

                        type:
                            "connection_request",

                        message:
                            `${req.user.firstName} sent you a connection request`,

                        relatedId:
                            data._id,

                        isRead:
                            false,
                    });


                // ==================================
                // SOCKET REAL-TIME NOTIFICATION
                // ==================================

                // We intentionally don't emit here
                // because this route doesn't have
                // direct access to the io instance.
                //
                // The database notification is still
                // created correctly.
            }


            res.json({
                message:
                    `${req.user.firstName} has sent a ${status} request to ${toUser.firstName}`,

                connectionRequest:
                    data,
            });

        } catch (err) {

            console.error(
                "Error sending connection request:",
                err
            );

            res.status(400).json({
                message:
                    "Error sending connection request: " +
                    err.message,
            });
        }
    }
);


requestRouter.post(
    "/request/review/:status/:requestID",
    authUser,
    async (req, res) => {

        try {

            const loggedInUser =
                req.user;

            const {
                status,
                requestID,
            } = req.params;


            // ======================================
            // VALIDATION
            // ======================================

            const allowedStatus = [
                "accepted",
                "rejected",
            ];


            if (
                !allowedStatus.includes(
                    status
                )
            ) {

                return res.status(400).json({
                    message:
                        "Invalid status",
                });
            }


            // ======================================
            // FIND REQUEST
            // ======================================

            const connectionRequest =
                await ConnectionRequest.findOne(
                    {
                        _id:
                            requestID,

                        toUserId:
                            loggedInUser._id,

                        status:
                            "interested",
                    }
                );


            if (!connectionRequest) {

                return res.status(404).json({
                    message:
                        "No pending connection request found for this user",
                });
            }


            // ======================================
            // UPDATE REQUEST
            // ======================================

            connectionRequest.status =
                status;


            const data =
                await connectionRequest.save();


            // ======================================
            // ACCEPTED NOTIFICATION
            // ======================================

            if (
                status ===
                "accepted"
            ) {

                await Notification.create({
                    recipientId:
                        connectionRequest
                            .fromUserId,

                    senderId:
                        loggedInUser._id,

                    type:
                        "connection_accepted",

                    message:
                        `${loggedInUser.firstName} accepted your connection request`,

                    relatedId:
                        connectionRequest._id,

                    isRead:
                        false,
                });
            }


            res.json({
                message:
                    `Connection request has been ${status}`,

                data,
            });

        } catch (err) {

            console.error(
                "Error reviewing connection request:",
                err
            );

            res.status(400).json({
                message:
                    "Error reviewing connection request: " +
                    err.message,
            });
        }
    }
);


module.exports =
    requestRouter;