import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Search } from "lucide-react";
import { BASE_URL } from "../utils/constants";

const DEFAULT_PROFILE =
    "https://i.sstatic.net/l60Hf.png";


const DeveloperSearch = () => {

    const navigate = useNavigate();


    // ==========================================
    // SEARCH
    // ==========================================

    const [searchQuery, setSearchQuery] =
        useState("");


    const [developers, setDevelopers] =
        useState([]);


    const [loading, setLoading] =
        useState(false);


    const [searched, setSearched] =
        useState(false);


    // ==========================================
    // SKILLS
    // ==========================================

    const [skills, setSkills] =
        useState([]);


    const [selectedSkill, setSelectedSkill] =
        useState("");


    const [skillsLoading, setSkillsLoading] =
        useState(true);


    // ==========================================
    // LOAD SKILLS FROM BACKEND
    // ==========================================

    useEffect(() => {

        const fetchSkills = async () => {

            try {

                setSkillsLoading(true);


                const response =
                    await axios.get(
                        `${BASE_URL}/user/skills`,
                        {
                            withCredentials: true
                        }
                    );


                setSkills(
                    response?.data?.skills || []
                );


            } catch (error) {

                console.error(
                    "Error fetching skills:",
                    error
                );


                setSkills([]);

            } finally {

                setSkillsLoading(false);

            }

        };


        fetchSkills();

    }, []);


    // ==========================================
    // SEARCH DEVELOPERS
    // ==========================================

    const searchDevelopers = async (
        skillOverride = selectedSkill
    ) => {

        const query =
            searchQuery.trim();


        // --------------------------------------
        // Don't search if both are empty
        // --------------------------------------

        if (
            !query &&
            !skillOverride
        ) {

            setDevelopers([]);

            setSearched(false);

            return;

        }


        try {

            setLoading(true);

            setSearched(true);


            const params = {};


            // Add text query if present
            if (query) {

                params.query = query;

            }


            // Add skill if selected
            if (skillOverride) {

                params.skill =
                    skillOverride;

            }


            const response =
                await axios.get(
                    `${BASE_URL}/user/search`,
                    {
                        params,

                        withCredentials: true
                    }
                );


            setDevelopers(
                response?.data?.users || []
            );


        } catch (error) {

            console.error(
                "Error searching developers:",
                error
            );


            setDevelopers([]);

        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // SKILL FILTER
    // ==========================================

    const handleSkillChange = (
        skill
    ) => {

        setSelectedSkill(skill);

        searchDevelopers(skill);

    };


    // ==========================================
    // CLEAR FILTER
    // ==========================================

    const clearSkillFilter = () => {

        setSelectedSkill("");


        if (searchQuery.trim()) {

            searchDevelopers("");

        } else {

            setDevelopers([]);

            setSearched(false);

        }

    };


    // ==========================================
    // SEND CONNECTION REQUEST
    // ==========================================

    const sendConnectionRequest =
        async (userId) => {

            try {

                await axios.post(

                    `${BASE_URL}/request/send/interested/${userId}`,

                    {},

                    {
                        withCredentials: true
                    }

                );


                // Immediately update button
                setDevelopers(
                    (previousDevelopers) =>

                        previousDevelopers.map(
                            (developer) =>

                                String(
                                    developer._id
                                ) ===
                                String(userId)

                                    ? {

                                        ...developer,

                                        connectionStatus:
                                            "pending"

                                    }

                                    : developer
                        )
                );


            } catch (error) {

                console.error(
                    "Error sending connection request:",
                    error
                );


                alert(

                    error?.response?.data
                        ?.message ||

                    "Unable to send connection request"

                );

            }

        };


    // ==========================================
    // ENTER KEY SEARCH
    // ==========================================

    const handleKeyDown =
        (event) => {

            if (
                event.key ===
                "Enter"
            ) {

                searchDevelopers();

            }

        };


    // ==========================================
    // UI
    // ==========================================

    return (

        <div className="min-h-screen bg-base-300 py-10 px-4">

            <div className="max-w-5xl mx-auto">


                {/* ==================================
                    HEADER
                =================================== */}

                <h1 className="text-4xl font-bold text-center mb-3">

                    Find Developers

                </h1>


                <p className="text-center text-base-content/70 mb-8">

                    Search developers by name, skill, or expertise

                </p>


                {/* ==================================
                    SEARCH BOX
                =================================== */}

                <div className="flex gap-3 max-w-2xl mx-auto mb-6">

                    <div className="relative flex-1">

                        <Search
                            size={20}
                            className="absolute left-4 top-1/2 -translate-y-1/2 opacity-60"
                        />


                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(event) =>
                                setSearchQuery(
                                    event.target.value
                                )
                            }
                            onKeyDown={handleKeyDown}
                            placeholder="Search Rahul, React, Node.js..."
                            className="input input-bordered w-full pl-11"
                        />

                    </div>


                    <button
                        onClick={() =>
                            searchDevelopers()
                        }
                        className="btn btn-primary"
                        disabled={loading}
                    >

                        {loading
                            ? "Searching..."
                            : "Search"}

                    </button>

                </div>


                {/* ==================================
                    SKILL FILTER
                =================================== */}

                <div className="mb-10">

                    <div className="flex items-center justify-between mb-3">

                        <h3 className="font-semibold">

                            Filter by Skill

                        </h3>


                        {selectedSkill && (

                            <button
                                onClick={
                                    clearSkillFilter
                                }
                                className="btn btn-ghost btn-sm"
                            >

                                Clear Filter

                            </button>

                        )}

                    </div>


                    {skillsLoading ? (

                        <div className="flex items-center gap-2">

                            <span className="loading loading-spinner loading-sm"></span>

                            <span>
                                Loading skills...
                            </span>

                        </div>

                    ) : skills.length === 0 ? (

                        <p className="text-base-content/60">

                            No skills available.

                        </p>

                    ) : (

                        <div className="flex flex-wrap gap-2">


                            {/* ALL SKILLS */}

                            <button
                                onClick={
                                    clearSkillFilter
                                }
                                className={
                                    !selectedSkill
                                        ? "btn btn-primary btn-sm"
                                        : "btn btn-outline btn-sm"
                                }
                            >

                                All Skills

                            </button>


                            {/* DYNAMIC SKILLS */}

                            {skills.map(
                                (skill) => (

                                    <button
                                        key={skill}
                                        onClick={() =>
                                            handleSkillChange(
                                                skill
                                            )
                                        }
                                        className={
                                            selectedSkill ===
                                            skill

                                                ? "btn btn-primary btn-sm"

                                                : "btn btn-outline btn-sm"
                                        }
                                    >

                                        {skill}

                                    </button>

                                )
                            )}

                        </div>

                    )}

                </div>


                {/* ==================================
                    LOADING
                =================================== */}

                {loading && (

                    <div className="flex justify-center">

                        <span className="loading loading-spinner loading-lg"></span>

                    </div>

                )}


                {/* ==================================
                    NO RESULTS
                =================================== */}

                {!loading &&
                    searched &&
                    developers.length === 0 && (

                        <div className="text-center mt-16">

                            <h2 className="text-2xl font-semibold">

                                No developers found

                            </h2>


                            <p className="text-base-content/60 mt-2">

                                Try another search or skill.

                            </p>

                        </div>

                    )}


                {/* ==================================
                    RESULTS
                =================================== */}

                {!loading &&
                    developers.length > 0 && (

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {developers.map(
                                (developer) => (

                                    <div
                                        key={
                                            developer._id
                                        }
                                        className="card bg-base-200 shadow-xl"
                                    >

                                        <div className="card-body">


                                            {/* ================================
                                                PROFILE HEADER
                                            ================================= */}

                                            <div className="flex items-center gap-4">


                                                {/* PROFILE PHOTO */}

                                                <div className="avatar">

                                                    <div className="w-20 rounded-full">

                                                        <img
                                                            src={
                                                                developer.photoUrl ||
                                                                DEFAULT_PROFILE
                                                            }
                                                            alt={
                                                                `${developer.firstName} ${developer.lastName}`
                                                            }
                                                            className="object-cover"
                                                        />

                                                    </div>

                                                </div>


                                                {/* NAME */}

                                                <div>

                                                    <h2 className="card-title">

                                                        {
                                                            developer.firstName
                                                        }{" "}

                                                        {
                                                            developer.lastName
                                                        }

                                                    </h2>


                                                    <div className="flex gap-2 mt-1">

                                                        {developer.age && (

                                                            <span className="badge badge-outline">

                                                                {
                                                                    developer.age
                                                                }{" "}
                                                                yrs

                                                            </span>

                                                        )}


                                                        {developer.gender && (

                                                            <span className="badge badge-primary">

                                                                {
                                                                    developer.gender
                                                                }

                                                            </span>

                                                        )}

                                                    </div>

                                                </div>

                                            </div>


                                            {/* ================================
                                                ABOUT
                                            ================================= */}

                                            {developer.about && (

                                                <p className="text-base-content/70 mt-4">

                                                    {
                                                        developer.about
                                                    }

                                                </p>

                                            )}


                                            {/* ================================
                                                SKILLS
                                            ================================= */}

                                            {developer.skills?.length > 0 && (

                                                <div className="flex flex-wrap gap-2 mt-4">

                                                    {developer.skills.map(
                                                        (skill) => (

                                                            <span
                                                                key={
                                                                    skill
                                                                }
                                                                className={
                                                                    "badge badge-outline badge-accent"
                                                                }
                                                            >

                                                                {skill}

                                                            </span>

                                                        )
                                                    )}

                                                </div>

                                            )}


                                            {/* ================================
                                                ACTION BUTTONS
                                            ================================= */}

                                            <div className="card-actions justify-end mt-5">


                                                {/* CONNECTED */}

                                                {developer.connectionStatus ===
                                                    "connected" && (

                                                    <button
                                                        className="btn btn-primary"
                                                        onClick={() =>
                                                            navigate(
                                                                `/chat/${developer._id}`
                                                            )
                                                        }
                                                    >

                                                        Chat

                                                    </button>

                                                )}


                                                {/* REQUEST SENT */}

                                                {developer.connectionStatus ===
                                                    "pending" && (

                                                    <button
                                                        className="btn btn-disabled"
                                                        disabled
                                                    >

                                                        Request Sent

                                                    </button>

                                                )}


                                                {/* CONNECT */}

                                                {(!developer.connectionStatus ||
                                                    developer.connectionStatus ===
                                                        "none") && (

                                                    <button
                                                        className="btn btn-primary"
                                                        onClick={() =>
                                                            sendConnectionRequest(
                                                                developer._id
                                                            )
                                                        }
                                                    >

                                                        Connect

                                                    </button>

                                                )}

                                            </div>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    )}

            </div>

        </div>

    );

};


export default DeveloperSearch;