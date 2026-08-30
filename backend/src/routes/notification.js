const express = require("express");

const notificationRouter = express.Router();

const { authUser } = require("../middleware/auth");
const Notification = require("../models/notification");


// ==========================================
// GET NOTIFICATIONS
// ==========================================

notificationRouter.get(
    "/notifications",
    authUser,
    async (req, res) => {

        try {

            const userId = req.user._id;

            const notifications =
                await Notification.find({
                    recipientId: userId,
                })
                    .populate(
                        "senderId",
                        "firstName lastName photoUrl"
                    )
                    .sort({
                        createdAt: -1,
                    })
                    .limit(50);

            res.json({
                notifications,
            });

        } catch (err) {

            console.error(
                "Error fetching notifications:",
                err
            );

            res.status(500).json({
                message:
                    "Error fetching notifications",
            });
        }
    }
);


// ==========================================
// GET UNREAD NOTIFICATION COUNT
// ==========================================

notificationRouter.get(
    "/notifications/unread-count",
    authUser,
    async (req, res) => {

        try {

            const userId = req.user._id;

            const unreadCount =
                await Notification.countDocuments({
                    recipientId: userId,
                    isRead: false,
                });

            res.json({
                unreadCount,
            });

        } catch (err) {

            console.error(
                "Error fetching notification count:",
                err
            );

            res.status(500).json({
                message:
                    "Error fetching notification count",
            });
        }
    }
);


// ==========================================
// MARK ONE NOTIFICATION AS READ
// ==========================================

notificationRouter.patch(
    "/notifications/:notificationId/read",
    authUser,
    async (req, res) => {

        try {

            const userId = req.user._id;

            const {
                notificationId,
            } = req.params;

            const notification =
                await Notification.findOneAndUpdate(
                    {
                        _id: notificationId,
                        recipientId: userId,
                    },
                    {
                        $set: {
                            isRead: true,
                        },
                    },
                    {
                        new: true,
                    }
                );

            if (!notification) {

                return res.status(404).json({
                    message:
                        "Notification not found",
                });
            }

            res.json({
                message:
                    "Notification marked as read",
                notification,
            });

        } catch (err) {

            console.error(
                "Error marking notification as read:",
                err
            );

            res.status(500).json({
                message:
                    "Error marking notification as read",
            });
        }
    }
);


// ==========================================
// MARK MESSAGE NOTIFICATIONS FROM ONE USER
// AS READ
// ==========================================
//
// Example:
//
// User A sends 3 messages to User B
//
// Notification documents:
//
// senderId: A
// recipientId: B
// type: "message"
// isRead: false
//
// When B opens A's chat,
// all these message notifications
// become read.
//
// Connection notifications are NOT affected.
// ==========================================

notificationRouter.patch(
    "/notifications/messages/:senderId/read",
    authUser,
    async (req, res) => {

        try {

            const recipientId =
                req.user._id;

            const {
                senderId,
            } = req.params;


            const result =
                await Notification.updateMany(
                    {
                        recipientId,
                        senderId,
                        type: "message",
                        isRead: false,
                    },
                    {
                        $set: {
                            isRead: true,
                        },
                    }
                );


            res.json({
                message:
                    "Message notifications marked as read",

                modifiedCount:
                    result.modifiedCount,
            });

        } catch (err) {

            console.error(
                "Error marking message notifications as read:",
                err
            );

            res.status(500).json({
                message:
                    "Error marking message notifications as read",
            });
        }
    }
);


// ==========================================
// MARK ALL NOTIFICATIONS AS READ
// ==========================================

notificationRouter.patch(
    "/notifications/read-all",
    authUser,
    async (req, res) => {

        try {

            const userId = req.user._id;

            const result =
                await Notification.updateMany(
                    {
                        recipientId: userId,
                        isRead: false,
                    },
                    {
                        $set: {
                            isRead: true,
                        },
                    }
                );

            res.json({
                message:
                    "All notifications marked as read",

                modifiedCount:
                    result.modifiedCount,
            });

        } catch (err) {

            console.error(
                "Error marking all notifications as read:",
                err
            );

            res.status(500).json({
                message:
                    "Error marking notifications as read",
            });
        }
    }
);


module.exports = notificationRouter;
