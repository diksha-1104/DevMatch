import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import { useEffect } from "react";
import UserCard from "./UserCard";


const Feed=()=>{
    const feed=useSelector((store)=>store.feed);
    const dispatch=useDispatch();
    const getFeed = async () => {
        if (Array.isArray(feed) && feed.length > 0) {
            return;
        }

        try {
            const response = await axios.get(BASE_URL + "/feed", {
                withCredentials: true,
            });
            const payload = response?.data?.users || response?.data?.data || response?.data || [];
            dispatch(addFeed(payload));
        } catch (err) {
            console.error(err);
        }
    };
useEffect(()=>{
    getFeed();
},[]);

if (!feed || !Array.isArray(feed) || feed.length === 0) {
    return (
        <div className="flex justify-center my-10">
            <p className="text-gray-500">No feed available</p>
        </div>
    );
}

return (
    <div className="flex justify-center my-10">
        <UserCard user={feed[0]} />
    </div>
);



};

export default Feed;