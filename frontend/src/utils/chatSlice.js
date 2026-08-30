import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: "chat",

    initialState: {
        unreadByUser: {},
        totalUnread: 0,
    },

    reducers: {
        // ==========================================
        // LOAD COUNTS FROM BACKEND
        // ==========================================

        setUnreadByUser: (state, action) => {
            const unreadByUser =
                action.payload || {};

            state.unreadByUser = unreadByUser;

            state.totalUnread =
                Object.values(unreadByUser).reduce(
                    (total, count) =>
                        total + Number(count || 0),
                    0
                );
        },

        // ==========================================
        // NEW MESSAGE
        // ==========================================

        incrementUnread: (state, action) => {
            const userId =
                String(action.payload);

            state.unreadByUser[userId] =
                (state.unreadByUser[userId] || 0) + 1;

            state.totalUnread += 1;
        },

        // ==========================================
        // MARK USER CHAT AS READ
        // ==========================================

        markUserMessagesRead: (
            state,
            action
        ) => {
            const userId =
                String(action.payload);

            const previousCount =
                state.unreadByUser[userId] || 0;

            state.totalUnread =
                Math.max(
                    0,
                    state.totalUnread -
                        previousCount
                );

            state.unreadByUser[userId] = 0;
        },

        // ==========================================
        // CLEAR
        // ==========================================

        clearChat: (state) => {
            state.unreadByUser = {};
            state.totalUnread = 0;
        },
    },
});

export const {
    setUnreadByUser,
    incrementUnread,
    markUserMessagesRead,
    clearChat,
} = chatSlice.actions;

export default chatSlice.reducer;