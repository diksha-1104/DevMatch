import { createSlice } from "@reduxjs/toolkit";

const requestSlice = createSlice({
  name: "requests",

  initialState: [],

  reducers: {

    // ==========================================
    // ADD / REPLACE REQUESTS
    // ==========================================

    addRequests: (state, action) => {

      if (Array.isArray(action.payload)) {
        return action.payload;
      }

      return (
        action.payload?.connectionRequests || []
      );
    },

    // ==========================================
    // REMOVE REQUEST AFTER ACCEPT / REJECT
    // ==========================================

    removeRequest: (state, action) => {

      return state.filter(
        (request) =>
          String(request._id) !==
          String(action.payload)
      );

    },

  },
});

export const {
  addRequests,
  removeRequest,
} = requestSlice.actions;

export default requestSlice.reducer;
