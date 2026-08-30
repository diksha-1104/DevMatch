import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import { Link } from "react-router-dom";

const Connections = () => {


const dispatch = useDispatch();


// ==========================================
// CONNECTIONS
// ==========================================

const connections = useSelector(
    (store) => store.connections
);


// ==========================================
// ONLINE USERS
// ==========================================

const onlineUsers = useSelector(
    (store) =>
        store.presence?.onlineUsers || []
);


// ==========================================
// UNREAD CHAT COUNTS
// ==========================================

const unreadByUser = useSelector(
    (store) =>
        store.chat?.unreadByUser || {}
);


// ==========================================
// FETCH CONNECTIONS
// ==========================================

const fetchConnections = async () => {

    try {

        const response =
            await axios.get(
                BASE_URL +
                    "/user/connections",
                {
                    withCredentials:
                        true,
                }
            );


        dispatch(
            addConnections(
                response?.data?.data || []
            )
        );

    } catch (err) {

        console.error(
            "Error fetching connections:",
            err
        );

    }

};


// ==========================================
// LOAD CONNECTIONS
// ==========================================

useEffect(() => {

    fetchConnections();

}, []);


// ==========================================
// EMPTY STATE
// ==========================================

if (!connections) {
    return null;
}


if (connections.length === 0) {

    return (

        <div className="flex justify-center mt-20">

            <h1 className="text-2xl font-bold text-base-content">

                No Connections Found

            </h1>

        </div>

    );

}


return (

    <div className="min-h-screen bg-base-300 py-10 px-4">


        <h1 className="text-4xl font-bold text-center mb-8">

            Your Connections

        </h1>


        <div className="max-w-5xl mx-auto space-y-5">


            {connections.map(
                (connection) => {

                    const {
                        _id,
                        firstName,
                        lastName,
                        age,
                        gender,
                        about,
                        skills,
                        photoUrl,
                    } = connection;


                    // ======================================
                    // ONLINE STATUS
                    // ======================================

                    const isOnline =
                        onlineUsers.includes(
                            String(_id)
                        );


                    // ======================================
                    // UNREAD MESSAGE COUNT
                    // ======================================

                    const unreadCount =
                        unreadByUser[
                            String(_id)
                        ] || 0;


                    return (

                        <div
                            key={_id}
                            className="
                                card
                                card-side
                                bg-base-200
                                shadow-xl
                                border
                                border-base-100
                                hover:shadow-2xl
                                transition
                            "
                        >


                            {/* ==================================
                                PROFILE IMAGE
                            ================================== */}

                            <figure className="w-44 h-44 relative">

                                <img
                                    src={
                                        photoUrl ||
                                        "https://i.sstatic.net/l60Hf.png"
                                    }
                                    alt={
                                        `${firstName} ${lastName}`
                                    }
                                    className="
                                        w-full
                                        h-full
                                        object-cover
                                    "
                                />


                                {/* ONLINE DOT */}

                                <span
                                    className={`
                                        absolute
                                        bottom-2
                                        right-2
                                        w-4
                                        h-4
                                        rounded-full
                                        border-2
                                        border-base-200
                                        ${
                                            isOnline
                                                ? "bg-green-500"
                                                : "bg-gray-400"
                                        }
                                    `}
                                />

                            </figure>


                            {/* ==================================
                                CARD CONTENT
                            ================================== */}

                            <div className="card-body">


                                {/* ==================================
                                    NAME
                                ================================== */}

                                <div className="flex items-center gap-3 flex-wrap">

                                    <h2 className="card-title text-2xl">

                                        {firstName}{" "}
                                        {lastName}

                                    </h2>


                                    {age && (

                                        <div className="badge badge-outline">

                                            {age} yrs

                                        </div>

                                    )}


                                    {gender && (

                                        <div className="badge badge-primary">

                                            {gender}

                                        </div>

                                    )}

                                </div>


                                {/* ==================================
                                    ONLINE / OFFLINE
                                ================================== */}

                                <div>

                                    {isOnline ? (

                                        <span className="text-sm text-green-500 font-medium">

                                            ● Online

                                        </span>

                                    ) : (

                                        <span className="text-sm text-gray-400">

                                            ● Offline

                                        </span>

                                    )}

                                </div>


                                {/* ==================================
                                    ABOUT
                                ================================== */}

                                {about && (

                                    <p className="text-base-content/80">

                                        {about}

                                    </p>

                                )}


                                {/* ==================================
                                    SKILLS
                                ================================== */}

                                {skills?.length > 0 && (

                                    <div className="flex flex-wrap gap-2 mt-2">

                                        {skills.map(
                                            (skill) => (

                                                <span
                                                    key={skill}
                                                    className="
                                                        badge
                                                        badge-outline
                                                        badge-accent
                                                    "
                                                >

                                                    {skill}

                                                </span>

                                            )
                                        )}

                                    </div>

                                )}


                                {/* ==================================
                                    CHAT BUTTON
                                ================================== */}

                                <div className="flex justify-end mt-3">

                                    <Link
                                        to={`/chat/${_id}`}
                                    >

                                        <button
                                            className="
                                                btn
                                                btn-primary
                                                relative
                                            "
                                        >

                                            💬 Chat


                                            {/* ==================================
                                                UNREAD BADGE
                                            ================================== */}

                                            {unreadCount > 0 && (

                                                <span
                                                    className="
                                                        absolute
                                                        -top-2
                                                        -right-2
                                                        bg-red-500
                                                        text-white
                                                        text-xs
                                                        font-bold
                                                        min-w-6
                                                        h-6
                                                        rounded-full
                                                        flex
                                                        items-center
                                                        justify-center
                                                        px-1
                                                        border-2
                                                        border-base-200
                                                    "
                                                >

                                                    {unreadCount > 99
                                                        ? "99+"
                                                        : unreadCount}

                                                </span>

                                            )}

                                        </button>

                                    </Link>

                                </div>

                            </div>

                        </div>

                    );

                }
            )}

        </div>

    </div>

);


};

export default Connections;
