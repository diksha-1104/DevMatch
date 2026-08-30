# 🚀 DevMatch

### Developer Networking & Real-Time Collaboration Platform

DevMatch is a full-stack developer networking platform that helps developers **discover other developers, connect based on skills and interests, and communicate through real-time chat**.

The application is built using the **MERN stack** with **Socket.IO** for real-time communication and **Redux Toolkit** for frontend state management.

---

## ✨ Features

### 🔐 Authentication & Authorization

* User registration and login
* JWT-based authentication
* Secure HTTP-only authentication cookies
* Password hashing using bcrypt
* Protected backend routes
* Logout functionality

### 👤 Developer Profiles

* Create and manage developer profiles
* Edit profile information
* Add skills and interests
* Update profile photo
* Display developer information to other users

### 🔎 Developer Discovery

* Discover other developers
* Search developers by name and profile information
* Search/filter based on skills
* Display connection status
* Prevent users from repeatedly interacting with existing connections/requests

### 🤝 Connection Management

* Send connection requests
* Accept connection requests
* Reject connection requests
* View received connection requests
* View accepted connections
* Prevent duplicate or invalid connection requests

### 💬 Real-Time Chat

* Chat between connected developers
* Real-time messaging using Socket.IO
* Persistent messages stored in MongoDB
* Load previous chat history
* Unread message counts
* Per-user unread message tracking
* Mark messages as read

### 🟢 Online / Offline Presence

* Real-time online/offline status
* Socket.IO-based presence tracking
* Supports multiple tabs/sockets for the same user
* Centralized frontend presence state

### 🔔 Notifications

* Connection-related notifications
* Message notifications
* Persistent notifications
* Unread notification count
* Mark individual notifications as read
* Mark all notifications as read
* Synchronization of message notification read state

---

# 🛠️ Tech Stack

## Frontend

* **React**
* **Vite**
* **React Router**
* **Redux Toolkit**
* **Axios**
* **Socket.IO Client**
* **Tailwind CSS**
* **DaisyUI**
* **Framer Motion**
* **Lucide React**

## Backend

* **Node.js**
* **Express.js**
* **MongoDB**
* **Mongoose**
* **Socket.IO**
* **JWT**
* **bcrypt**
* **cookie-parser**
* **CORS**
* **Validator**
* **dotenv**

---

# 📁 Project Structure

```text
DevMatch/
│
├── backend/
│   ├── package.json
│   ├── package-lock.json
│   │
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   └── socket.js
│   │   │
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   │
│   │   ├── models/
│   │   │   ├── user.js
│   │   │   ├── connectionRequest.js
│   │   │   ├── message.js
│   │   │   └── notification.js
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── profile.js
│   │   │   ├── user.js
│   │   │   ├── request.js
│   │   │   ├── chat.js
│   │   │   └── notification.js
│   │   │
│   │   ├── utils/
│   │   │   └── validation.js
│   │   │
│   │   └── index.js
│   │
│   └── ...
│
├── frontend/
│   ├── package.json
│   ├── package-lock.json
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── Body.jsx
│   │   │   ├── Chat.jsx
│   │   │   ├── Connections.jsx
│   │   │   ├── DeveloperSearch.jsx
│   │   │   ├── EditProfile.jsx
│   │   │   ├── Feed.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── NavBar.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Requests.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── UserCard.jsx
│   │   │
│   │   ├── config/
│   │   │   └── socket.js
│   │   │
│   │   ├── utils/
│   │   │   ├── appStore.js
│   │   │   ├── chatSlice.js
│   │   │   ├── connectionSlice.js
│   │   │   ├── feedSlice.js
│   │   │   ├── notificationSlice.js
│   │   │   ├── presenceSlice.js
│   │   │   ├── requestSlice.js
│   │   │   ├── userSlice.js
│   │   │   └── constants.js
│   │   │
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   └── ...
│
└── .gitignore
```

---

# 🏗️ Architecture

DevMatch follows a **client-server architecture**:

```text
                     ┌──────────────────────┐
                     │       FRONTEND       │
                     │                      │
                     │ React + Redux        │
                     │ React Router         │
                     │ Tailwind / DaisyUI   │
                     └──────────┬───────────┘
                                │
                     REST API   │   Socket.IO
                                │
                     ┌──────────▼───────────┐
                     │       BACKEND        │
                     │                      │
                     │ Node.js + Express    │
                     │ JWT Authentication   │
                     │ Socket.IO            │
                     └──────────┬───────────┘
                                │
                          Mongoose ODM
                                │
                     ┌──────────▼───────────┐
                     │       MongoDB        │
                     │                      │
                     │ Users                │
                     │ Connections          │
                     │ Messages             │
                     │ Notifications        │
                     └──────────────────────┘
```

---

# 🔄 Application Flow

```text
             ┌───────────────┐
             │     Signup    │
             └───────┬───────┘
                     ↓
             ┌───────────────┐
             │     Login     │
             └───────┬───────┘
                     ↓
             ┌───────────────┐
             │ Create/Edit   │
             │    Profile    │
             └───────┬───────┘
                     ↓
             ┌───────────────┐
             │   Discover    │
             │  Developers   │
             └───────┬───────┘
                     ↓
             ┌───────────────┐
             │ Search /      │
             │ Skill Filter  │
             └───────┬───────┘
                     ↓
             ┌───────────────┐
             │ Send Request  │
             └───────┬───────┘
                     ↓
             ┌───────────────┐
             │ Accept /      │
             │ Reject        │
             └───────┬───────┘
                     ↓
             ┌───────────────┐
             │ Connections   │
             └───────┬───────┘
                     ↓
             ┌───────────────┐
             │ Real-Time     │
             │ Chat          │
             └───────┬───────┘
                     ↓
        ┌────────────┴────────────┐
        ↓                         ↓
┌───────────────┐        ┌────────────────┐
│ Notifications │        │ Online/Offline │
└───────────────┘        │    Presence    │
                         └────────────────┘
```

---

# 🗄️ Database Models

## User

Stores developer profile and authentication information.

Main fields include:

```text
firstName
lastName
emailId
password
age
gender
about
skills
photoUrl
```

Passwords are stored in hashed form.

---

## ConnectionRequest

Represents a connection request between two developers.

The model tracks:

```text
fromUserId
toUserId
status
```

Supported request states include:

```text
interested
ignored
accepted
rejected
```

---

## Message

Stores chat messages between connected users.

Main information includes:

```text
senderId
receiverId
text
isRead
createdAt
updatedAt
```

Messages are persisted in MongoDB so that chat history remains available after refreshing the application.

---

## Notification

Stores user notifications such as:

```text
message
connection_request
connection_accepted
```

Notifications also maintain their read/unread state.

---

# 🔌 REST API

## Authentication

```http
POST /signup
POST /login
POST /logout
```

## Profile

```http
GET   /profile/view
PATCH /profile/edit
```

## Developer Discovery

```http
GET /feed
GET /user/search
GET /user/skills
```

## Connections

```http
GET  /user/connections
GET  /user/requests/received
POST /request/send/:status/:toUserId
POST /request/review/:status/:requestId
```

## Chat

```http
GET   /chat/:targetUserId
GET   /chat/unread-count
GET   /chat/unread-count/by-user
PATCH /chat/:targetUserId/read
```

## Notifications

```http
GET   /notifications
GET   /notifications/unread-count
PATCH /notifications/:notificationId/read
PATCH /notifications/read-all
PATCH /notifications/messages/:senderId/read
```

Protected endpoints require authentication through the JWT-based authentication middleware.

---

# ⚡ Real-Time Communication

Socket.IO is used for real-time functionality.

The application supports events for:

```text
userOnline
onlineUsers
userOffline
joinChat
sendMessage
messageReceived
```

The backend maintains online users and broadcasts presence changes to connected clients.

The frontend uses a shared Socket.IO connection to avoid unnecessarily creating multiple independent connections.

---

# 🔔 Notification Flow

For example, when a developer sends a message:

```text
Developer A
     │
     │ Send message
     ▼
Socket.IO
     │
     ▼
Backend
     │
     ├──────────────► MongoDB
     │                  │
     │                  └── Store message
     │
     └──────────────► Developer B
                        │
                        ├── New message
                        └── Notification
```

When Developer B opens the conversation, unread messages can be marked as read.

---

# 🚀 Getting Started

## Prerequisites

Install the following before running the project:

* Node.js
* npm
* MongoDB or MongoDB Atlas

---

## 1. Clone the Repository

```bash
git clone <your-repository-url>
cd DevMatch
```

---

# 2. Setup Backend

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside `backend/`:

```env
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
```

Add any other environment variables required by your deployment configuration.

### Start Backend

For development:

```bash
npm run dev
```

Or:

```bash
npm start
```

The backend will run on the configured port, typically:

```text
http://localhost:3000
```

---

# 3. Setup Frontend

Open a new terminal and navigate to:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The Vite development server will typically run on:

```text
http://localhost:5173
```

---

# 🔐 Environment Variables

Never commit secrets or credentials to GitHub.

Example backend `.env`:

```env
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

If the frontend uses environment-specific API configuration, create the appropriate Vite environment file, for example:

```env
VITE_API_URL=http://localhost:3000
```

Use production environment variables when deploying.

---

# 🛡️ Security

DevMatch implements several basic security mechanisms:

* Password hashing using bcrypt
* JWT authentication
* HTTP-only authentication cookies
* Protected API routes
* Server-side validation
* Authorization checks for user-specific resources
* Prevention of invalid/duplicate connection requests

For production deployment, additional hardening is recommended:

* Rate limiting
* Strict production CORS configuration
* Secure cookie settings
* Input sanitization
* API request validation
* HTTPS
* Environment-specific configuration
* Logging and monitoring

---

# 📱 Core User Experience

A typical user journey looks like:

```text
Register
   ↓
Login
   ↓
Complete Profile
   ↓
Discover Developers
   ↓
Search Developers
   ↓
Filter by Skills
   ↓
Send Connection Request
   ↓
Request Accepted
   ↓
Connection Created
   ↓
Start Chat
   ↓
Real-Time Messaging
   ↓
Receive Notifications
   ↓
Track Online/Offline Status
```

---

# ⚠️ Current Limitations

The current implementation has a few areas that can be improved:

* The developer feed backend supports multiple results, while the current feed UI may not display the complete result set.
* Connection-request notifications are persisted, but real-time delivery can be extended further.
* Production deployment requires environment-specific configuration.

These are planned improvement areas rather than core blockers for the current developer networking and chat functionality.

---

# 🔮 Future Improvements

Potential future enhancements include:

* 🤖 AI-powered developer recommendations
* 🔐 Google OAuth authentication
* 🔑 Forgot-password and password-reset flow
* 💬 Typing indicators
* ✓ Message delivery/read receipts
* 📎 File and image sharing in chat
* 🔎 Advanced developer filtering
* ♾️ Infinite scrolling
* 🔔 Fully real-time connection notifications
* 🧪 Unit and integration testing
* 📚 Swagger/OpenAPI documentation
* 🚀 Production deployment
* 📊 Analytics dashboard
* 🛡️ Rate limiting and advanced security

---

# 🎯 Why DevMatch?

DevMatch demonstrates practical full-stack development concepts including:

* REST API development
* Authentication and authorization
* MongoDB data modeling
* React component architecture
* Redux state management
* Real-time communication
* WebSocket-based presence tracking
* Persistent chat systems
* Notification systems
* Frontend/backend integration

Rather than being a simple CRUD application, DevMatch combines **social networking, relationship management, persistent messaging, notifications, and real-time presence** into one full-stack application.

---

# 👩‍💻 Author

**Diksha Kumari**

Developer Networking Platform built with:

```text
React
Node.js
Express.js
MongoDB
Socket.IO
Redux Toolkit
```

---

## ⭐ If you like this project

If you find DevMatch useful or interesting, consider giving the repository a ⭐.
