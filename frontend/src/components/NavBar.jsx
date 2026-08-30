import {
useDispatch,
useSelector,
} from "react-redux";

import {
Link,
useNavigate,
} from "react-router-dom";

import {
BASE_URL,
} from "../utils/constants";

import {
removeUser,
} from "../utils/userSlice";

import {
markNotificationRead,
markAllNotificationsRead,
} from "../utils/notificationSlice";

import axios from "axios";

import {
disconnectSocket,
} from "../config/socket";

const NavBar = () => {


const user =
    useSelector(
        (store) => store.user
    );


const notifications =
    useSelector(
        (store) =>
            store.notifications
                ?.notifications || []
    );


const unreadNotificationCount =
    useSelector(
        (store) =>
            store.notifications
                ?.unreadCount || 0
    );


const dispatch = useDispatch();

const navigate = useNavigate();


// ==========================================
// LOGOUT
// ==========================================

const handleLogout = async () => {

    try {

        // --------------------------------------
        // IMPORTANT:
        // Disconnect Socket.IO first.
        //
        // This causes the backend's
        // "disconnect" event to fire and
        // remove this user from online users.
        // --------------------------------------

        disconnectSocket();


        // --------------------------------------
        // Logout from backend
        // --------------------------------------

        await axios.post(
            BASE_URL + "/logout",
            {},
            {
                withCredentials:
                    true,
            }
        );


        // --------------------------------------
        // Remove user from Redux
        // --------------------------------------

        dispatch(
            removeUser()
        );


        // --------------------------------------
        // Navigate to login
        // --------------------------------------

        navigate("/login");

    } catch (err) {

        console.error(
            "Logout error:",
            err
        );


        // --------------------------------------
        // Even if logout API fails,
        // make sure socket is disconnected.
        // --------------------------------------

        disconnectSocket();


        dispatch(
            removeUser()
        );


        navigate("/login");

    }

};


// ==========================================
// MARK ONE NOTIFICATION READ
// ==========================================

const handleNotificationClick =
    async (notification) => {

        if (!notification?._id) {
            return;
        }


        if (!notification.isRead) {

            try {

                await axios.patch(
                    BASE_URL +
                        `/notifications/${notification._id}/read`,
                    {},
                    {
                        withCredentials:
                            true,
                    }
                );


                dispatch(
                    markNotificationRead(
                        notification._id
                    )
                );

            } catch (err) {

                console.error(
                    "Error marking notification:",
                    err
                );

            }

        }

    };


// ==========================================
// MARK ALL READ
// ==========================================

const handleMarkAllRead =
    async () => {

        try {

            await axios.patch(
                BASE_URL +
                    "/notifications/read-all",
                {},
                {
                    withCredentials:
                        true,
                }
            );


            dispatch(
                markAllNotificationsRead()
            );

        } catch (err) {

            console.error(
                "Error marking notifications:",
                err
            );

        }

    };


return (

    <div className="navbar bg-base-300 shadow-sm">


        {/* ==================================
            LOGO
        ================================== */}

        <div className="flex-1">

            <Link
                to="/"
                className="btn btn-ghost text-xl"
            >

                DevMatch

            </Link>

        </div>


        <div className="flex gap-2">


            {/* ==================================
                NOTIFICATION DROPDOWN
            ================================== */}

            {user && (

                <div className="dropdown dropdown-end">

                    <div
                        tabIndex={0}
                        role="button"
                        className="btn btn-ghost btn-circle"
                    >

                        <div className="relative">

                            <span className="text-xl">

                                🔔

                            </span>


                            {unreadNotificationCount >
                                0 && (

                                <span
                                    className="
                                        absolute
                                        -top-2
                                        -right-2
                                        bg-red-500
                                        text-white
                                        text-[10px]
                                        font-bold
                                        min-w-5
                                        h-5
                                        rounded-full
                                        flex
                                        items-center
                                        justify-center
                                        px-1
                                    "
                                >

                                    {
                                        unreadNotificationCount >
                                        99
                                            ? "99+"
                                            : unreadNotificationCount
                                    }

                                </span>

                            )}

                        </div>

                    </div>


                    <div
                        tabIndex={0}
                        className="
                            dropdown-content
                            bg-base-100
                            rounded-box
                            z-50
                            mt-3
                            w-80
                            shadow-xl
                            border
                            border-base-300
                        "
                    >

                        {/* HEADER */}

                        <div className="flex items-center justify-between p-3 border-b">

                            <h3 className="font-semibold">

                                Notifications

                            </h3>


                            {unreadNotificationCount >
                                0 && (

                                <button
                                    onClick={
                                        handleMarkAllRead
                                    }
                                    className="text-xs text-primary hover:underline"
                                >

                                    Mark all read

                                </button>

                            )}

                        </div>


                        {/* NOTIFICATIONS */}

                        <div className="max-h-96 overflow-y-auto">


                            {notifications.length ===
                            0 ? (

                                <div className="p-6 text-center text-sm text-base-content/60">

                                    No notifications

                                </div>

                            ) : (

                                notifications.map(
                                    (notification) => (

                                        <div
                                            key={
                                                notification._id
                                            }
                                            onClick={() =>
                                                handleNotificationClick(
                                                    notification
                                                )
                                            }
                                            className={`
                                                p-3
                                                border-b
                                                cursor-pointer
                                                hover:bg-base-200
                                                transition
                                                ${
                                                    !notification.isRead
                                                        ? "bg-base-200"
                                                        : ""
                                                }
                                            `}
                                        >

                                            <div className="flex gap-3">


                                                {/* SENDER PHOTO */}

                                                <div className="shrink-0">

                                                    {notification.senderId
                                                        ?.photoUrl ? (

                                                        <img
                                                            src={
                                                                notification
                                                                    .senderId
                                                                    .photoUrl
                                                            }
                                                            alt=""
                                                            className="w-10 h-10 rounded-full object-cover"
                                                        />

                                                    ) : (

                                                        <div className="w-10 h-10 rounded-full bg-primary text-primary-content flex items-center justify-center">

                                                            🔔

                                                        </div>

                                                    )}

                                                </div>


                                                {/* TEXT */}

                                                <div className="flex-1">

                                                    <p className="text-sm">

                                                        {notification
                                                            .senderId
                                                            ?.firstName && (

                                                            <span className="font-semibold">

                                                                {
                                                                    notification
                                                                        .senderId
                                                                        .firstName
                                                                }{" "}

                                                                {
                                                                    notification
                                                                        .senderId
                                                                        .lastName
                                                                }{" "}

                                                            </span>

                                                        )}

                                                        {
                                                            notification.message
                                                        }

                                                    </p>


                                                    <p className="text-xs text-base-content/50 mt-1">

                                                        {notification.createdAt
                                                            ? new Date(
                                                                  notification.createdAt
                                                              ).toLocaleString()
                                                            : ""}

                                                    </p>

                                                </div>


                                                {/* UNREAD DOT */}

                                                {!notification.isRead && (

                                                    <span className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0" />

                                                )}

                                            </div>

                                        </div>

                                    )
                                )

                            )}

                        </div>

                    </div>

                </div>

            )}


            {/* ==================================
                PROFILE DROPDOWN
            ================================== */}

            <div className="dropdown dropdown-end mx-5">

                <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-ghost btn-circle avatar"
                >

                    {user && (

                        <div className="w-10 rounded-full">

                            <img
                                alt="Profile"
                                src={
                                    user.photoUrl ||
                                    "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                                }
                            />

                        </div>

                    )}

                </div>


                <ul
                    tabIndex="-1"
                    className="
                        menu
                        menu-sm
                        dropdown-content
                        bg-base-100
                        rounded-box
                        z-50
                        mt-3
                        w-52
                        p-2
                        shadow
                    "
                >

                    <li>

                        <Link
                            to="/profile"
                            className="justify-between"
                        >

                            Profile

                        </Link>

                    </li>


                    <li>

                        <Link to="/search">

                            Search Developers

                        </Link>

                    </li>


                    <li>

                        <Link to="/connections">

                            Connections

                        </Link>

                    </li>


                    <li>

                        <Link to="/requests">

                            Requests

                        </Link>

                    </li>


                    <li>

                        <button
                            onClick={
                                handleLogout
                            }
                        >

                            Logout

                        </button>

                    </li>

                </ul>

            </div>

        </div>

    </div>

);


};

export default NavBar;
