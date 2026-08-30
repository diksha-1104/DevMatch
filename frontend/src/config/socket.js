import { io } from "socket.io-client";
import { BASE_URL } from "../utils/constants";

let socket = null;

// ==========================================
// CREATE / GET SINGLE SOCKET CONNECTION
// ==========================================

export const createSocketConnection = () => {
    if (!socket) {
        socket = io(BASE_URL, {
            withCredentials: true,
            transports: ["websocket"],
            autoConnect: true,
        });

        socket.on("connect", () => {
            console.log(
                "Socket connected:",
                socket.id
            );
        });

        socket.on("disconnect", (reason) => {
            console.log(
                "Socket disconnected:",
                reason
            );
        });

        socket.on("connect_error", (error) => {
            console.error(
                "Socket connection error:",
                error.message
            );
        });
    }

    return socket;
};

// ==========================================
// GET EXISTING SOCKET
// ==========================================

export const getSocket = () => {
    return socket;
};

// ==========================================
// DISCONNECT SOCKET
// ==========================================

export const disconnectSocket = () => {
    if (socket) {
        socket.removeAllListeners();
        socket.disconnect();
        socket = null;
    }
};
