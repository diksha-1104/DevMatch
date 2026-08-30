import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import feedReducer from "./feedSlice";
import connectionReducer from "./connectionSlice"
import requestReducer from "./requestSlice"
import presenceReducer from "./presenceSlice"
import notificationReducer from "./notificationSlice";
import chatReducer from "./chatSlice";

const appStore = configureStore({
  reducer: {
    user:userReducer,
    feed: feedReducer,
    connections:connectionReducer,
    requests:requestReducer,
    presence: presenceReducer,
    notifications: notificationReducer,
    chat: chatReducer,
  },
});

export default appStore;
