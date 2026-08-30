import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
    name: "feed",
    initialState: [],
    reducers: {
        addFeed: (state, action) => {
            if (Array.isArray(action.payload)) return action.payload;
            return (
                action.payload?.users || action.payload?.data || action.payload || []
            );
        },
        removeFeed: (state, action) => {
            if (!Array.isArray(state)) return state;
            return state.filter((user) => user._id !== action.payload);
        },
    },
});

export const{addFeed,removeFeed}=feedSlice.actions;
export default feedSlice.reducer;