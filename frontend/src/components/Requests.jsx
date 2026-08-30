import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import {
  addRequests,
  removeRequest,
} from "../utils/requestSlice";
import { useEffect, useState } from "react";

const DEFAULT_PROFILE =
  "https://i.sstatic.net/l60Hf.png";

const Requests = () => {
  const dispatch = useDispatch();

  const requests = useSelector(
    (store) => store.requests || []
  );

  const [processingId, setProcessingId] =
    useState(null);

  // ==========================================
  // FETCH REQUESTS
  // ==========================================

  const fetchRequests = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/user/requests/received`,
        {
          withCredentials: true,
        }
      );

      const payload =
        response?.data?.connectionRequests ||
        response?.data?.data ||
        [];

      dispatch(addRequests(payload));

    } catch (error) {
      console.error(
        "Error fetching requests:",
        error
      );
    }
  };

  // ==========================================
  // ACCEPT / REJECT REQUEST
  // ==========================================

  const reviewRequest = async (
    status,
    requestId
  ) => {

    try {

      setProcessingId(requestId);

      await axios.post(
        `${BASE_URL}/request/review/${status}/${requestId}`,
        {},
        {
          withCredentials: true,
        }
      );

      // Immediately remove the request
      // from frontend state.
      dispatch(removeRequest(requestId));

    } catch (error) {

      console.error(
        `Error ${status} request:`,
        error
      );

    } finally {

      setProcessingId(null);

    }
  };

  // ==========================================
  // LOAD REQUESTS
  // ==========================================

  useEffect(() => {
    fetchRequests();
  }, []);

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-screen bg-base-300 py-10 px-4">

      <h1 className="text-4xl font-bold text-center mb-8">
        Connection Requests
      </h1>

      {requests.length === 0 ? (

        <div className="flex justify-center mt-16">

          <h2 className="text-2xl font-semibold text-base-content">
            No Requests Found
          </h2>

        </div>

      ) : (

        <div className="max-w-5xl mx-auto space-y-5">

          {requests.map((request) => {

            const requestUser =
              request?.fromUserId;

            const isProcessing =
              processingId === request._id;

            return (

              <div
                key={request._id}
                className="card card-side bg-base-200 shadow-xl border border-base-100 hover:shadow-2xl transition"
              >

                {/* PROFILE PHOTO */}

                <figure className="w-44 h-44">

                  <img
                    src={
                      requestUser?.photoUrl ||
                      DEFAULT_PROFILE
                    }
                    alt={
                      requestUser?.firstName ||
                      "Profile"
                    }
                    className="w-full h-full object-cover"
                  />

                </figure>

                <div className="card-body">

                  {/* NAME */}

                  <div className="flex items-center gap-3 flex-wrap">

                    <h2 className="card-title text-2xl">

                      {requestUser?.firstName}{" "}
                      {requestUser?.lastName}

                    </h2>

                    {requestUser?.age && (
                      <div className="badge badge-outline">
                        {requestUser.age} yrs
                      </div>
                    )}

                    {requestUser?.gender && (
                      <div className="badge badge-primary">
                        {requestUser.gender}
                      </div>
                    )}

                  </div>

                  {/* ABOUT */}

                  {requestUser?.about && (
                    <p className="text-base-content/80">
                      {requestUser.about}
                    </p>
                  )}

                  {/* SKILLS */}

                  {requestUser?.skills?.length > 0 && (

                    <div className="flex flex-wrap gap-2 mt-2">

                      {requestUser.skills.map(
                        (skill) => (

                          <span
                            key={skill}
                            className="badge badge-outline badge-accent"
                          >
                            {skill}
                          </span>

                        )
                      )}

                    </div>

                  )}

                  {/* ACTIONS */}

                  <div className="card-actions justify-end mt-5">

                    <button
                      className="btn btn-error btn-outline"
                      disabled={isProcessing}
                      onClick={() =>
                        reviewRequest(
                          "rejected",
                          request._id
                        )
                      }
                    >

                      {isProcessing
                        ? "Processing..."
                        : "Reject"}

                    </button>

                    <button
                      className="btn btn-success"
                      disabled={isProcessing}
                      onClick={() =>
                        reviewRequest(
                          "accepted",
                          request._id
                        )
                      }
                    >

                      {isProcessing
                        ? "Processing..."
                        : "Accept"}

                    </button>

                  </div>

                </div>

              </div>

            );
          })}

        </div>

      )}

    </div>
  );
};

export default Requests;
