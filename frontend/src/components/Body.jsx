import NavBar from "./NavBar";

import {
    Outlet,
    useNavigate,
} from "react-router-dom";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    BASE_URL,
} from "../utils/constants";

import axios from "axios";

import {
    addUser,
} from "../utils/userSlice";

import {
    useEffect,
} from "react";

import {
    createSocketConnection,
} from "../config/socket";

import {
    setOnlineUsers,
    addOnlineUser,
    removeOnlineUser,
} from "../utils/presenceSlice";

import {
    setUnreadByUser,
    incrementUnread,
} from "../utils/chatSlice";

import {
    setNotifications,
    setUnreadCount,
    addNotification,
} from "../utils/notificationSlice";


const Body = () => {

    const dispatch = useDispatch();

    const navigate = useNavigate();


    // ==========================================
    // CURRENT USER
    // ==========================================

    const userData =
        useSelector(
            (store) => store.user
        );


    // ==========================================
    // FETCH LOGGED-IN USER
    // ==========================================

    const fetchUser = async () => {

        try {

            const response =
                await axios.get(
                    `${BASE_URL}/profile/view`,
                    {
                        withCredentials: true,
                    }
                );


            dispatch(
                addUser(
                    response.data
                )
            );

        } catch (error) {

            console.error(
                "Error fetching user:",
                error
            );


            if (
                error.response?.status ===
                401
            ) {

                navigate("/login");
            }
        }
    };


    // ==========================================
    // LOAD CURRENT USER
    // ==========================================

    useEffect(() => {

        if (!userData) {

            fetchUser();
        }

    }, []);


    // ==========================================
    // LOAD INITIAL APP DATA
    // ==========================================

    useEffect(() => {

        if (
            !userData?._id
        ) {
            return;
        }


        const loadAppData =
            async () => {

                try {

                    // ==================================
                    // UNREAD MESSAGE COUNTS
                    // ==================================

                    const unreadResponse =
                        await axios.get(
                            `${BASE_URL}/chat/unread-count/by-user`,
                            {
                                withCredentials: true,
                            }
                        );


                    dispatch(
                        setUnreadByUser(
                            unreadResponse
                                .data
                                ?.unreadByUser ||
                                {}
                        )
                    );


                    // ==================================
                    // NOTIFICATIONS
                    // ==================================

                    const notificationResponse =
                        await axios.get(
                            `${BASE_URL}/notifications`,
                            {
                                withCredentials: true,
                            }
                        );


                    dispatch(
                        setNotifications(
                            notificationResponse
                                .data
                                ?.notifications ||
                                []
                        )
                    );


                    // ==================================
                    // NOTIFICATION UNREAD COUNT
                    // ==================================

                    const notificationCountResponse =
                        await axios.get(
                            `${BASE_URL}/notifications/unread-count`,
                            {
                                withCredentials: true,
                            }
                        );


                    dispatch(
                        setUnreadCount(
                            notificationCountResponse
                                .data
                                ?.unreadCount ||
                                0
                        )
                    );

                } catch (error) {

                    console.error(
                        "Error loading application data:",
                        error
                    );
                }
            };


        loadAppData();

    }, [
        userData?._id,
    ]);


    // ==========================================
    // GLOBAL SOCKET
    // ==========================================

    useEffect(() => {

        if (
            !userData?._id
        ) {
            return;
        }


        const socket =
            createSocketConnection();


        // ======================================
        // USER ONLINE
        // ======================================

        socket.emit(
            "userOnline",
            userData._id
        );


        // ======================================
        // CURRENT ONLINE USERS
        // ======================================

        const handleOnlineUsers =
            (payload) => {

                const userIds =
                    payload?.userIds ||
                    [];


                dispatch(
                    setOnlineUsers(
                        userIds.map(
                            (id) =>
                                String(id)
                        )
                    )
                );
            };


        // ======================================
        // USER BECOMES ONLINE
        // ======================================

        const handleUserOnline =
            (payload) => {

                const userId =
                    payload?.userId;


                if (!userId) {
                    return;
                }


                dispatch(
                    addOnlineUser(
                        String(userId)
                    )
                );
            };


        // ======================================
        // USER BECOMES OFFLINE
        // ======================================

        const handleUserOffline =
            (payload) => {

                const userId =
                    payload?.userId;


                if (!userId) {
                    return;
                }


                dispatch(
                    removeOnlineUser(
                        String(userId)
                    )
                );
            };


        // ======================================
        // NEW MESSAGE
        // ======================================

        const handleMessageReceived =
            (newMessage) => {

                if (!newMessage) {
                    return;
                }


                const senderId =
                    String(
                        newMessage.senderId
                    );


                const receiverId =
                    String(
                        newMessage.receiverId
                    );


                const currentUserId =
                    String(
                        userData._id
                    );


                // --------------------------------
                // Ignore messages sent by ourselves
                // --------------------------------

                if (
                    senderId ===
                    currentUserId
                ) {

                    return;
                }


                // --------------------------------
                // Only process messages where
                // current user is the receiver
                // --------------------------------

                if (
                    receiverId !==
                    currentUserId
                ) {

                    return;
                }


                // --------------------------------
                // Increment unread count
                // --------------------------------

                dispatch(
                    incrementUnread(
                        senderId
                    )
                );
            };


        // ======================================
        // NEW NOTIFICATION
        // ======================================

        const handleNotification =
            (notification) => {

                if (!notification) {
                    return;
                }


                dispatch(
                    addNotification(
                        notification
                    )
                );
            };


        // ======================================
        // SOCKET LISTENERS
        // ======================================

        socket.on(
            "onlineUsers",
            handleOnlineUsers
        );


        socket.on(
            "userOnline",
            handleUserOnline
        );


        socket.on(
            "userOffline",
            handleUserOffline
        );


        socket.on(
            "messageReceived",
            handleMessageReceived
        );


        socket.on(
            "newNotification",
            handleNotification
        );


        // ======================================
        // CLEANUP
        // ======================================

        return () => {

            socket.off(
                "onlineUsers",
                handleOnlineUsers
            );


            socket.off(
                "userOnline",
                handleUserOnline
            );


            socket.off(
                "userOffline",
                handleUserOffline
            );


            socket.off(
                "messageReceived",
                handleMessageReceived
            );


            socket.off(
                "newNotification",
                handleNotification
            );
        };

    }, [
        userData?._id,
        dispatch,
    ]);


    // ==========================================
    // RENDER
    // ==========================================

    return (

        <div>

            <NavBar />

            <Outlet />

        </div>
    );
};


export default Body;
