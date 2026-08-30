const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const initializeSocket = require("./config/socket");

const app = express();

require("dotenv").config();

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use(cookieParser());
app.use(express.json());

// ==========================================
// ROUTES
// ==========================================

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const userRouter = require("./routes/user");
const requestRouter = require("./routes/request");
const chatRouter = require("./routes/chat");
const notificationRouter = require("./routes/notification");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", userRouter);
app.use("/", requestRouter);
app.use("/", chatRouter);

// IMPORTANT: notification routes
app.use("/", notificationRouter);

// ==========================================
// SERVER + SOCKET.IO
// ==========================================

const server = http.createServer(app);

initializeSocket(server);

// ==========================================
// DATABASE
// ==========================================

connectDB()
    .then(() => {
        console.log("Connected to the database");

        server.listen(3000, () => {
            console.log("Server is running on port 3000");
        });
    })
    .catch((err) => {
        console.error(
            "Failed to connect to the database:",
            err
        );

        process.exit(1);
    });