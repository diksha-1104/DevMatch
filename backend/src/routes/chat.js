const express = require("express");
const chatRouter = express.Router();

const { authUser } = require("../middleware/auth");
const Message = require("../models/message");


// ==========================================
// GET CHAT HISTORY
// ==========================================

chatRouter.get(
    "/chat/:targetUserId",
    authUser,
    async (req, res) => {

        try {

            const loggedInUserId = req.user._id;
            const { targetUserId } = req.params;

            const messages = await Message.find({
                $or: [
                    {
                        senderId: loggedInUserId,
                        receiverId: targetUserId,
                    },
                    {
                        senderId: targetUserId,
                        receiverId: loggedInUserId,
                    },
                ],
            }).sort({
                createdAt: 1,
            });

            res.json(messages);

        } catch (err) {

            console.error(
                "Error fetching chat history:",
                err
            );

            res.status(500).json({
                message: "Error fetching chat history",
            });
        }
    }
);


// ==========================================
// GET TOTAL UNREAD MESSAGE COUNT
// ==========================================

chatRouter.get(
    "/chat/unread-count",
    authUser,
    async (req, res) => {

        try {

            const loggedInUserId = req.user._id;

            const unreadCount = await Message.countDocuments({
                receiverId: loggedInUserId,
                isRead: false,
            });

            res.json({
                unreadCount,
            });

        } catch (err) {

            console.error(
                "Error fetching unread count:",
                err
            );

            res.status(500).json({
                message: "Error fetching unread count",
            });
        }
    }
);


// ==========================================
// GET UNREAD COUNT BY USER
// ==========================================

chatRouter.get(
    "/chat/unread-count/by-user",
    authUser,
    async (req, res) => {

        try {

            const loggedInUserId = req.user._id;

            const unreadMessages = await Message.aggregate([
                {
                    $match: {
                        receiverId: loggedInUserId,
                        isRead: false,
                    },
                },

                {
                    $group: {
                        _id: "$senderId",
                        count: {
                            $sum: 1,
                        },
                    },
                },
            ]);

            const unreadByUser = {};

            unreadMessages.forEach((item) => {
                unreadByUser[item._id.toString()] =
                    item.count;
            });

            res.json({
                unreadByUser,
            });

        } catch (err) {

            console.error(
                "Error fetching unread messages by user:",
                err
            );

            res.status(500).json({
                message:
                    "Error fetching unread messages by user",
            });
        }
    }
);


// ==========================================
// MARK CHAT MESSAGES AS READ
// ==========================================

chatRouter.patch(
    "/chat/:targetUserId/read",
    authUser,
    async (req, res) => {

        try {

            const loggedInUserId = req.user._id;
            const { targetUserId } = req.params;

            const result = await Message.updateMany(
                {
                    senderId: targetUserId,
                    receiverId: loggedInUserId,
                    isRead: false,
                },
                {
                    $set: {
                        isRead: true,
                    },
                }
            );

            res.json({
                message: "Messages marked as read",
                modifiedCount: result.modifiedCount,
            });

        } catch (err) {

            console.error(
                "Error marking messages as read:",
                err
            );

            res.status(500).json({
                message: "Error marking messages as read",
            });
        }
    }
);


module.exports = chatRouter;