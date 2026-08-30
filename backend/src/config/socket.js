const socket = require("socket.io");

const Message = require("../models/message");
const Notification = require("../models/notification");
const User = require("../models/user");

// userId -> Set of socket IDs
const onlineUsers = new Map();


const initializeSocket = (server) => {

    const io = socket(server, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true,
        },
    });


    io.on("connection", (socket) => {

        console.log(
            "User connected:",
            socket.id
        );


        // ==========================================
        // USER ONLINE
        // ==========================================

        socket.on(
            "userOnline",
            (userId) => {

                if (!userId) {
                    return;
                }


                const normalizedUserId =
                    String(userId);


                if (
                    !onlineUsers.has(
                        normalizedUserId
                    )
                ) {

                    onlineUsers.set(
                        normalizedUserId,
                        new Set()
                    );
                }


                const userSockets =
                    onlineUsers.get(
                        normalizedUserId
                    );


                const wasOffline =
                    userSockets.size === 0;


                userSockets.add(
                    socket.id
                );


                socket.userId =
                    normalizedUserId;


                console.log(
                    `User ${normalizedUserId} is online`
                );


                // Send current online users
                socket.emit(
                    "onlineUsers",
                    {
                        userIds:
                            Array.from(
                                onlineUsers.keys()
                            ),
                    }
                );


                // Notify everyone else
                if (wasOffline) {

                    socket.broadcast.emit(
                        "userOnline",
                        {
                            userId:
                                normalizedUserId,
                        }
                    );
                }
            }
        );


        // ==========================================
        // JOIN CHAT
        // ==========================================

        socket.on(
            "joinChat",
            ({
                userId,
                targetUserId,
            }) => {

                if (
                    !userId ||
                    !targetUserId
                ) {
                    return;
                }


                const roomId = [
                    String(userId),
                    String(targetUserId),
                ]
                    .sort()
                    .join("_");


                socket.join(
                    roomId
                );


                console.log(
                    `${socket.id} joined ${roomId}`
                );
            }
        );


        // ==========================================
        // SEND MESSAGE
        // ==========================================

        socket.on(
            "sendMessage",
            async ({
                userId,
                targetUserId,
                text,
            }) => {

                try {

                    if (
                        !userId ||
                        !targetUserId ||
                        !text ||
                        !text.trim()
                    ) {
                        return;
                    }


                    const senderId =
                        String(userId);

                    const receiverId =
                        String(targetUserId);


                    // =================================
                    // SAVE MESSAGE
                    // =================================

                    const message =
                        await Message.create({
                            senderId,
                            receiverId,
                            text:
                                text.trim(),
                            isRead: false,
                        });


                    console.log(
                        "Message saved:",
                        message._id
                    );


                    // =================================
                    // CHAT ROOM
                    // =================================

                    const roomId = [
                        senderId,
                        receiverId,
                    ]
                        .sort()
                        .join("_");


                    // =================================
                    // SEND MESSAGE
                    // =================================

                    io.to(roomId).emit(
                        "messageReceived",
                        {
                            _id:
                                message._id,

                            senderId,

                            receiverId,

                            text:
                                message.text,

                            createdAt:
                                message.createdAt,

                            isRead:
                                message.isRead,
                        }
                    );


                    // =================================
                    // CREATE NOTIFICATION
                    // =================================

                    const notification =
                        await Notification.create({
                            recipientId:
                                receiverId,

                            senderId:
                                senderId,

                            type:
                                "message",

                            message:
                                "You received a new message",

                            relatedId:
                                message._id,

                            isRead:
                                false,
                        });


                    // =================================
                    // GET SENDER
                    // =================================

                    const sender =
                        await User.findById(
                            senderId
                        ).select(
                            "firstName lastName photoUrl"
                        );


                    // =================================
                    // REAL-TIME NOTIFICATION
                    // =================================

                    const receiverSockets =
                        onlineUsers.get(
                            receiverId
                        );


                    if (
                        receiverSockets
                    ) {

                        receiverSockets.forEach(
                            (socketId) => {

                                io.to(
                                    socketId
                                ).emit(
                                    "newNotification",
                                    {
                                        _id:
                                            notification._id,

                                        senderId: {
                                            _id:
                                                senderId,

                                            firstName:
                                                sender
                                                    ?.firstName ||
                                                "",

                                            lastName:
                                                sender
                                                    ?.lastName ||
                                                "",

                                            photoUrl:
                                                sender
                                                    ?.photoUrl ||
                                                "",
                                        },

                                        recipientId:
                                            receiverId,

                                        type:
                                            "message",

                                        message:
                                            notification
                                                .message,

                                        relatedId:
                                            String(
                                                message._id
                                            ),

                                        isRead:
                                            false,

                                        createdAt:
                                            notification
                                                .createdAt,
                                    }
                                );
                            }
                        );
                    }

                } catch (err) {

                    console.error(
                        "Error sending message:",
                        err
                    );
                }
            }
        );


        // ==========================================
        // DISCONNECT
        // ==========================================

        socket.on(
            "disconnect",
            () => {

                console.log(
                    "User disconnected:",
                    socket.id
                );


                const userId =
                    socket.userId;


                if (!userId) {
                    return;
                }


                const userSockets =
                    onlineUsers.get(
                        userId
                    );


                if (!userSockets) {
                    return;
                }


                userSockets.delete(
                    socket.id
                );


                // Only offline when
                // all tabs/windows are disconnected

                if (
                    userSockets.size === 0
                ) {

                    onlineUsers.delete(
                        userId
                    );


                    io.emit(
                        "userOffline",
                        {
                            userId,
                        }
                    );


                    console.log(
                        `User ${userId} is offline`
                    );
                }
            }
        );
    });
};


module.exports =
    initializeSocket;