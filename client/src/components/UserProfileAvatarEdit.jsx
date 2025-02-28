import React, { useState } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import { updatedAvatar } from "../store/userSlice";
import { IoClose } from "react-icons/io5";
import Cookies from "js-cookie";

const UserProfileAvatarEdit = ({ close }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleUploadAvatarImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      setLoading(true);
      const csrfToken = Cookies.get("csrftoken");

      const response = await Axios({
        ...SummaryApi.uploadAvtar,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          "X-CSRFToken": csrfToken,
        },
        withCredentials: true,
      });

      const { data: responseData } = response;
      dispatch(updatedAvatar(responseData.data.avatar));
      close();
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="fixed inset-0 bg-black/60 p-4 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm relative">
        <button
          onClick={close}
          className="absolute top-4 right-4 p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors duration-200"
        >
          <IoClose size={24} />
        </button>

        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
            {user?.avatar ? (
              <img
                alt={user.name}
                src={user.avatar}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <FaRegUserCircle className="text-gray-400" size={65} />
              </div>
            )}
          </div>
          <h2 className="text-lg font-semibold text-gray-800">Update Avatar</h2>
        </div>

        <label
          htmlFor="uploadProfile"
          className={`block text-center px-6 py-4 rounded-xl transition-colors duration-200 ${
            loading
              ? "bg-gray-100 text-gray-500 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
          }`}
        >
          <span className="text-sm font-medium">
            {loading ? "Uploading..." : "Choose New Avatar"}
          </span>
          <input
            type="file"
            id="uploadProfile"
            className="hidden"
            accept="image/*"
            onChange={handleUploadAvatarImage}
            disabled={loading}
          />
        </label>
      </div>
    </section>
  );
};

export default UserProfileAvatarEdit;
