import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeFeed } from "../utils/feedSlice";

const UserCard = ({ user }) => {
  if (!user) {
    return <h1>Loading...</h1>;
  }

  const {
    _id,
    firstName,
    lastName,
    age,
    gender,
    about,
    skills,
    photoUrl,
  } = user;

  const dispatch=useDispatch();
  const handleSendRequest=async(status,userId)=>{
    try{
      const response=await axios.post(
        BASE_URL+"/request/send/"+status+"/"+userId,
        {},
        {withCredentials:true}
      );

      dispatch(removeFeed(userId));

    }catch(err){
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center items-center bg-base-300 p-6">
      <div className="relative">
        <div className="card w-80 bg-base-200 shadow-2xl rounded-3xl border border-base-100/10 overflow-hidden">
          <figure className="relative h-[480px]">
            <img
              src={photoUrl || "https://i.sstatic.net/l60Hf.png" }
              alt="profile"
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

            <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold">
                  {firstName}
                  {lastName && ` ${lastName}`}
                  {age && `, ${age}`}
                </h2>

                {gender && (
                  <div className="badge badge-primary">
                    {gender}
                  </div>
                )}
              </div>

              {about && (
                <p className="text-gray-300 text-sm mt-2 line-clamp-3">
                  {about}
                </p>
              )}

              {skills?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="badge badge-outline badge-accent"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </figure>
        </div>

        <div className="flex justify-center gap-6 mt-6">
          <button className="btn btn-circle btn-lg bg-base-100 border-0 shadow-xl hover:scale-110 transition" onClick={()=>handleSendRequest("ignored",_id)}>
            ❌
          </button>

          <button className="btn btn-circle btn-lg bg-error text-white border-0 shadow-xl hover:scale-110 transition"
          onClick={()=>handleSendRequest("interested",_id)}>
            ❤️
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;