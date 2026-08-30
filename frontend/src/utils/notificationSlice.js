import { createSlice } from "@reduxjs/toolkit";


const notificationSlice = createSlice({

    name: "notifications",

    initialState: {
        notifications: [],
        unreadCount: 0,
    },


    reducers: {

        // ==========================================
        // LOAD NOTIFICATIONS
        // ==========================================

        setNotifications: (
            state,
            action
        ) => {

            state.notifications =
                action.payload || [];

            state.unreadCount =
                state.notifications.filter(
                    (notification) =>
                        !notification.isRead
                ).length;
        },


        // ==========================================
        // LOAD UNREAD COUNT
        // ==========================================

        setUnreadCount: (
            state,
            action
        ) => {

            state.unreadCount =
                Number(
                    action.payload || 0
                );
        },


        // ==========================================
        // NEW REAL-TIME NOTIFICATION
        // ==========================================

        addNotification: (
            state,
            action
        ) => {

            const notification =
                action.payload;


            if (!notification?._id) {
                return;
            }


            // Prevent duplicate notification

            const alreadyExists =
                state.notifications.some(
                    (item) =>
                        String(item._id) ===
                        String(
                            notification._id
                        )
                );


            if (alreadyExists) {
                return;
            }


            state.notifications.unshift(
                notification
            );


            if (
                !notification.isRead
            ) {

                state.unreadCount += 1;
            }
        },


        // ==========================================
        // MARK ONE NOTIFICATION AS READ
        // ==========================================

        markNotificationRead: (
            state,
            action
        ) => {

            const notificationId =
                String(action.payload);


            const notification =
                state.notifications.find(
                    (item) =>
                        String(item._id) ===
                        notificationId
                );


            if (
                notification &&
                !notification.isRead
            ) {

                notification.isRead =
                    true;


                state.unreadCount =
                    Math.max(
                        0,
                        state.unreadCount - 1
                    );
            }
        },


        // ==========================================
        // MARK ALL MESSAGE NOTIFICATIONS FROM
        // ONE USER AS READ
        // ==========================================

        markMessageNotificationsRead: (
            state,
            action
        ) => {

            const senderId =
                String(action.payload);


            let numberMarkedRead = 0;


            state.notifications =
                state.notifications.map(
                    (notification) => {

                        const notificationSenderId =
                            notification
                                .senderId?._id ||
                            notification.senderId;


                        const isMessageFromUser =
                            String(
                                notificationSenderId
                            ) === senderId &&
                            notification.type ===
                                "message";


                        if (
                            isMessageFromUser &&
                            !notification.isRead
                        ) {

                            numberMarkedRead += 1;


                            return {
                                ...notification,
                                isRead: true,
                            };
                        }


                        return notification;
                    }
                );


            state.unreadCount =
                Math.max(
                    0,
                    state.unreadCount -
                        numberMarkedRead
                );
        },


        // ==========================================
        // MARK ALL AS READ
        // ==========================================

        markAllNotificationsRead: (
            state
        ) => {

            state.notifications =
                state.notifications.map(
                    (notification) => ({
                        ...notification,
                        isRead: true,
                    })
                );


            state.unreadCount = 0;
        },


        // ==========================================
        // CLEAR
        // ==========================================

        clearNotifications: (
            state
        ) => {

            state.notifications = [];

            state.unreadCount = 0;
        },
    },
});


export const {
    setNotifications,
    setUnreadCount,
    addNotification,
    markNotificationRead,
    markMessageNotificationsRead,
    markAllNotificationsRead,
    clearNotifications,
} = notificationSlice.actions;


export default notificationSlice.reducer;