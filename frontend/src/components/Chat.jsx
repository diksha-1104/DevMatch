import { useParams } from "react-router-dom";

import {
    Search,
    SendHorizontal,
} from "lucide-react";

import {
    useEffect,
    useRef,
    useState,
    useCallback,
} from "react";

import {
    createSocketConnection,
} from "../config/socket";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import axios from "axios";

import {
    BASE_URL,
} from "../utils/constants";

import {
    markUserMessagesRead,
} from "../utils/chatSlice";

import {
    markMessageNotificationsRead,
} from "../utils/notificationSlice";


const DEFAULT_PROFILE =
    "https://i.sstatic.net/l60Hf.png";


const Chat = () => {

    const {
        targetUserId,
    } = useParams();


    const dispatch =
        useDispatch();


    // ==========================================
    // STATE
    // ==========================================

    const [messages, setMessages] =
        useState([]);

    const [newMessage, setNewMessage] =
        useState("");

    const [targetUser, setTargetUser] =
        useState(null);

    const [loadingUser, setLoadingUser] =
        useState(true);


    // ==========================================
    // CURRENT USER
    // ==========================================

    const user =
        useSelector(
            (store) => store.user
        );


    const userId =
        user?._id;


    // ==========================================
    // ONLINE USERS
    // ==========================================

    const onlineUsers =
        useSelector(
            (store) =>
                store.presence
                    ?.onlineUsers || []
        );


    const isOnline =
        onlineUsers.includes(
            String(targetUserId)
        );


    // ==========================================
    // SOCKET REF
    // ==========================================

    const socketRef =
        useRef(null);


    // ==========================================
    // MARK CHAT MESSAGES AS READ
    // ==========================================

    const markMessagesAsRead =
        useCallback(
            async () => {

                if (
                    !userId ||
                    !targetUserId
                ) {
                    return;
                }


                try {

                    // --------------------------------
                    // MARK CHAT MESSAGES AS READ
                    // --------------------------------

                    await axios.patch(
                        `${BASE_URL}/chat/${targetUserId}/read`,
                        {},
                        {
                            withCredentials:
                                true,
                        }
                    );


                    // --------------------------------
                    // CLEAR CHAT UNREAD COUNT
                    // --------------------------------

                    dispatch(
                        markUserMessagesRead(
                            targetUserId
                        )
                    );


                    // --------------------------------
                    // MARK MESSAGE NOTIFICATIONS
                    // FROM THIS USER AS READ
                    // --------------------------------

                    await axios.patch(
                        `${BASE_URL}/notifications/messages/${targetUserId}/read`,
                        {},
                        {
                            withCredentials:
                                true,
                        }
                    );


                    // --------------------------------
                    // CLEAR BELL COUNT FOR THIS
                    // USER'S MESSAGE NOTIFICATIONS
                    // --------------------------------

                    dispatch(
                        markMessageNotificationsRead(
                            targetUserId
                        )
                    );

                } catch (error) {

                    console.error(
                        "Error marking messages as read:",
                        error
                    );
                }

            },
            [
                userId,
                targetUserId,
                dispatch,
            ]
        );


    // ==========================================
    // LOAD USER + CHAT HISTORY
    // ==========================================

    useEffect(() => {

        if (
            !userId ||
            !targetUserId
        ) {
            return;
        }


        let isMounted = true;


        const loadChat =
            async () => {

                try {

                    setLoadingUser(true);


                    // --------------------------------
                    // LOAD TARGET USER
                    // --------------------------------

                    const userResponse =
                        await axios.get(
                            `${BASE_URL}/user/profile/${targetUserId}`,
                            {
                                withCredentials:
                                    true,
                            }
                        );


                    if (isMounted) {

                        setTargetUser(
                            userResponse.data
                        );
                    }


                    // --------------------------------
                    // LOAD CHAT HISTORY
                    // --------------------------------

                    const chatResponse =
                        await axios.get(
                            `${BASE_URL}/chat/${targetUserId}`,
                            {
                                withCredentials:
                                    true,
                            }
                        );


                    if (isMounted) {

                        setMessages(
                            chatResponse.data ||
                                []
                        );
                    }


                    // --------------------------------
                    // MARK BOTH CHAT + MESSAGE
                    // NOTIFICATIONS AS READ
                    // --------------------------------

                    await markMessagesAsRead();

                } catch (error) {

                    console.error(
                        "Error loading chat:",
                        error
                    );

                } finally {

                    if (isMounted) {

                        setLoadingUser(
                            false
                        );
                    }
                }
            };


        loadChat();


        return () => {

            isMounted = false;
        };

    }, [
        userId,
        targetUserId,
        markMessagesAsRead,
    ]);


    // ==========================================
    // SOCKET CONNECTION
    // ==========================================

    useEffect(() => {

        if (
            !userId ||
            !targetUserId
        ) {
            return;
        }


        // IMPORTANT:
        // This returns the SAME global
        // Socket.IO connection.

        const socket =
            createSocketConnection();


        socketRef.current =
            socket;


        // --------------------------------------
        // JOIN CHAT
        // --------------------------------------

        socket.emit(
            "joinChat",
            {
                userId,
                targetUserId,
            }
        );


        // --------------------------------------
        // RECEIVE MESSAGE
        // --------------------------------------

        const handleMessageReceived =
            (message) => {

                if (!message) {
                    return;
                }


                const senderId =
                    String(
                        message.senderId
                    );


                const receiverId =
                    String(
                        message.receiverId
                    );


                const currentUserId =
                    String(userId);


                const currentTargetUserId =
                    String(
                        targetUserId
                    );


                // --------------------------------
                // MESSAGE FROM TARGET USER
                // --------------------------------

                const isFromTargetUser =
                    senderId ===
                    currentTargetUserId;


                const isToLoggedInUser =
                    receiverId ===
                    currentUserId;


                const belongsToCurrentChat =
                    isFromTargetUser &&
                    isToLoggedInUser;


                // --------------------------------
                // MESSAGE SENT BY ME
                // --------------------------------

                const isSentByMe =
                    senderId ===
                    currentUserId;


                // --------------------------------
                // IGNORE OTHER CONVERSATIONS
                // --------------------------------

                if (
                    !belongsToCurrentChat &&
                    !isSentByMe
                ) {
                    return;
                }


                // --------------------------------
                // ADD MESSAGE TO UI
                // --------------------------------

                setMessages(
                    (previousMessages) => {

                        const alreadyExists =
                            previousMessages.some(
                                (
                                    existingMessage
                                ) =>
                                    String(
                                        existingMessage._id
                                    ) ===
                                    String(
                                        message._id
                                    )
                            );


                        if (
                            alreadyExists
                        ) {
                            return previousMessages;
                        }


                        return [
                            ...previousMessages,
                            message,
                        ];
                    }
                );


                // --------------------------------
                // CURRENT CHAT IS OPEN
                //
                // Clear its notification
                // from Redux immediately.
                // --------------------------------

                if (
                    belongsToCurrentChat
                ) {

                    dispatch(
                        markMessageNotificationsRead(
                            targetUserId
                        )
                    );
                }
            };


        socket.on(
            "messageReceived",
            handleMessageReceived
        );


        // --------------------------------------
        // CLEANUP
        // --------------------------------------

        return () => {

            socket.off(
                "messageReceived",
                handleMessageReceived
            );


            socketRef.current =
                null;
        };

    }, [
        userId,
        targetUserId,
        dispatch,
    ]);


    // ==========================================
    // SEND MESSAGE
    // ==========================================

    const sendMessage = () => {

        const trimmedMessage =
            newMessage.trim();


        if (!trimmedMessage) {
            return;
        }


        if (
            !socketRef.current
        ) {

            console.error(
                "Socket is not connected"
            );

            return;
        }


        socketRef.current.emit(
            "sendMessage",
            {
                userId,
                targetUserId,
                text: trimmedMessage,
            }
        );


        setNewMessage("");
    };


    // ==========================================
    // ENTER TO SEND
    // ==========================================

    const handleKeyDown =
        (event) => {

            if (
                event.key ===
                    "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();

                sendMessage();
            }
        };


    // ==========================================
    // RENDER
    // ==========================================

    return (

        <div className="min-h-screen bg-base-300 flex justify-center items-center">

            <div className="w-full max-w-md h-screen md:h-[700px] bg-base-200 flex flex-col shadow-2xl">


                {/* HEADER */}

                <div className="navbar bg-base-100 border-b border-base-300 px-4">

                    <div className="flex-1 flex items-center gap-3">

                        <div className="avatar">

                            <div className="w-11 rounded-full">

                                <img
                                    src={
                                        targetUser?.photoUrl ||
                                        DEFAULT_PROFILE
                                    }
                                    alt={
                                        targetUser
                                            ? `${targetUser.firstName} ${
                                                  targetUser.lastName ||
                                                  ""
                                              }`
                                            : "Profile"
                                    }
                                    className="object-cover"
                                />

                            </div>

                        </div>


                        <div>

                            <h2 className="font-bold text-lg">

                                {loadingUser
                                    ? "Loading..."
                                    : `${targetUser?.firstName || ""} ${
                                          targetUser?.lastName ||
                                          ""
                                      }`.trim() ||
                                      "User"}

                            </h2>


                            {isOnline ? (

                                <p className="text-xs text-success">

                                    ● Online

                                </p>

                            ) : (

                                <p className="text-xs opacity-60">

                                    ● Offline

                                </p>

                            )}

                        </div>

                    </div>


                    <Search
                        className="cursor-pointer"
                        size={20}
                    />

                </div>


                {/* MESSAGES */}

                <div className="flex-1 overflow-y-auto p-4 space-y-4">

                    {messages.length ===
                        0 && (

                        <div className="text-center text-xs opacity-60">

                            No messages yet

                        </div>
                    )}


                    {messages.map(
                        (
                            message,
                            index
                        ) => {

                            const isMyMessage =
                                String(
                                    message.senderId
                                ) ===
                                String(
                                    userId
                                );


                            return (

                                <div
                                    key={
                                        message._id ||
                                        index
                                    }
                                    className={`chat ${
                                        isMyMessage
                                            ? "chat-end"
                                            : "chat-start"
                                    }`}
                                >

                                    <div
                                        className={`chat-bubble ${
                                            isMyMessage
                                                ? "chat-bubble-primary"
                                                : "bg-base-300 text-white"
                                        }`}
                                    >

                                        {
                                            message.text
                                        }

                                    </div>


                                    <div className="chat-footer opacity-60 text-xs mt-1">

                                        {
                                            message.createdAt
                                                ? new Date(
                                                      message.createdAt
                                                  ).toLocaleTimeString(
                                                      [],
                                                      {
                                                          hour: "2-digit",
                                                          minute: "2-digit",
                                                      }
                                                  )
                                                : ""
                                        }

                                    </div>

                                </div>
                            );
                        }
                    )}

                </div>


                {/* INPUT */}

                <div className="p-4 bg-base-100 border-t border-base-300">

                    <div className="flex items-center gap-2">

                        <input
                            value={
                                newMessage
                            }
                            onChange={(
                                event
                            ) =>
                                setNewMessage(
                                    event.target.value
                                )
                            }
                            onKeyDown={
                                handleKeyDown
                            }
                            type="text"
                            placeholder="Type a message..."
                            className="input input-bordered rounded-full flex-1"
                        />


                        <button
                            onClick={
                                sendMessage
                            }
                            className="btn btn-primary btn-circle"
                        >

                            <SendHorizontal
                                size={18}
                            />

                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
};


export default Chat;
