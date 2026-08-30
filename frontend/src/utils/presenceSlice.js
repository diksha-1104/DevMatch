import { createSlice } from "@reduxjs/toolkit";

const presenceSlice = createSlice({
    name: "presence",

    initialState: {
        onlineUsers: [],
    },

    reducers: {
        // Set the complete list of currently online users
        setOnlineUsers: (state, action) => {
            state.onlineUsers = action.payload.map(
                (userId) => String(userId)
            );
        },

        // Add a user when they come online
        addOnlineUser: (state, action) => {
            const userId = String(action.payload);

            if (!state.onlineUsers.includes(userId)) {
                state.onlineUsers.push(userId);
            }
        },

        // Remove a user when they go offline
        removeOnlineUser: (state, action) => {
            const userId = String(action.payload);

            state.onlineUsers =
                state.onlineUsers.filter(
                    (id) => id !== userId
                );
        },

        // Clear presence state when needed
        clearOnlineUsers: (state) => {
            state.onlineUsers = [];
        },
    },
});

export const {
    setOnlineUsers,
    addOnlineUser,
    removeOnlineUser,
    clearOnlineUsers,
} = presenceSlice.actions;

export default presenceSlice.reducer;