import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice"; 
import { useEffect, useState } from "react";
import UserCard from "./UserCard";
import { BASE_URL } from "../utils/constants";
import axios from "axios";

const EditProfile = ({user}) => {
 
 const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    about: "",
    photoUrl: "",
    skills: "",
  });
  const[error,setError]=useState("");
  const [showToast, setShowToast] = useState(false);
  const dispatch=useDispatch();

  // Populate the form whenever the logged-in user is available
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        age: user.age || "",
        gender: user.gender || "",
        about: user.about || "",
        photoUrl: user.photoUrl || "",
        skills: user.skills?.join(", ") || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };


  const handleSave = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        age: formData.age ? Number(formData.age) : null,
        gender: formData.gender,
        about: formData.about,
        photoUrl: formData.photoUrl,
        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
      };

      const res = await axios.patch(`${BASE_URL}/profile/edit`, payload, {
        withCredentials: true,
      });

      const updatedUser = res?.data?.data || res?.data?.user || res?.data;
      if (updatedUser) {
  dispatch(addUser(updatedUser));

  setShowToast(true);

  setTimeout(() => {
    setShowToast(false);
  }, 3000);
}
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data ||
          "Failed to update profile"
      );
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-base-300 flex justify-center items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-300 flex flex-col lg:flex-row justify-center items-center gap-10 p-8">

      {/* Edit Form */}
      <div className="card w-full max-w-md bg-base-200 shadow-2xl rounded-3xl border border-base-100/10">
        <div className="card-body">

          <h2 className="text-2xl font-bold text-center mb-2">
            Edit Profile
          </h2>

          <div className="flex justify-center mb-6">
            <div className="relative">
              <img
                src={
                  formData.photoUrl ||
                  "https://i.sstatic.net/l60Hf.png"
                }
                alt="profile"
                className="w-28 h-28 rounded-full object-cover border-4 border-base-300"
              />

              <button
                type="button"
                className="btn btn-circle btn-primary btn-sm absolute bottom-1 right-1"
              >
                ✏️
              </button>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">

            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              className="input input-bordered w-full"
              value={formData.firstName}
              onChange={handleChange}
            />

            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              className="input input-bordered w-full"
              value={formData.lastName}
              onChange={handleChange}
            />

            <input
              type="number"
              name="age"
              placeholder="Age"
              className="input input-bordered w-full"
              value={formData.age}
              onChange={handleChange}
            />

            <select
              name="gender"
              className="select select-bordered w-full"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>

            <textarea
              name="about"
              placeholder="About yourself..."
              className="textarea textarea-bordered h-24 w-full"
              value={formData.about}
              onChange={handleChange}
            />

            <input
              type="text"
              name="skills"
              placeholder="Skills (comma separated)"
              className="input input-bordered w-full"
              value={formData.skills}
              onChange={handleChange}
            />

            <input
              type="text"
              name="photoUrl"
              placeholder="Photo URL"
              className="input input-bordered w-full"
              value={formData.photoUrl}
              onChange={handleChange}
            />

            <button type="submit" className="btn btn-primary w-full">
              Save Profile
            </button>

          </form>

        </div>
      </div>

      {/* Live Preview */}
      <UserCard
        user={{
          firstName: formData.firstName,
          lastName: formData.lastName,
          age: formData.age,
          gender: formData.gender,
          about: formData.about,
          photoUrl: formData.photoUrl,
          skills: formData.skills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean),
        }}
      />
      {showToast && (
  <div className="toast toast-top toast-center z-50">
    <div className="alert alert-success">
      <span>✅ Profile updated successfully!</span>
    </div>
  </div>
)}

    </div>
  );
};

export default EditProfile;