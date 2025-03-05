import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import uploadImage from "../utils/UploadImage";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import { FiUploadCloud } from "react-icons/fi";

// upload catergoy page Add Category 

const UploadCategoryModel = ({ close, fetchData }) => {
  const [data, setData] = useState({
    name: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data.name.trim()) {
      toast.error("Please enter a category name.");
      return;
    }

    setLoading(true);
    try {
      const response = await Axios({
        ...SummaryApi.addCategory,
        data: data,
      });

      const { data: responseData } = response;
      if (responseData.success) {
        toast.success(responseData.message);
        close();
        if (typeof fetchData === "function") {
          fetchData();
        }
      } else {
        toast.error(responseData.message || "Something went wrong.");
        if (typeof fetchData === "function") {
          fetchData();
        }
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadCategoryImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      const response = await uploadImage(file);
      console.log("Image upload response:", response);

      if (response?.data?.url || response?.data?.imageUrl) {
        setData((prev) => ({
          ...prev,
          image: response.data.url || response.data.imageUrl,
        }));
      } else if (response?.url) {
        setData((prev) => ({ ...prev, image: response.url }));
      } else {
        toast.error("Invalid image upload response.");
        console.error("Invalid response format:", response);
      }
    } catch (error) {
      toast.error("Failed to upload image.");
      console.error("Image upload error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="fixed inset-0 bg-black/50 backdrop-blur-sm   z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden transform transition-all">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h1 className="text-xl font-semibold text-gray-800">Create New Category</h1>
          <button
            onClick={close}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <IoClose className="text-gray-600 w-6 h-6" />
          </button>
        </div>

        {/* Form Content */}
        <form className="p-6 space-y-6" onSubmit={handleSubmit}>
          {/* Name Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Category Name</label>
            <input
              type="text"
              placeholder="Enter category name"
              value={data.name}
              name="name"
              onChange={handleOnChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              autoFocus
            />
          </div>

          {/* Image Upload Section */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Category Image</label>

            <div className="flex flex-col lg:flex-row gap-6 items-start">
              {/* Image Preview */}
              <div className="relative w-full lg:w-40 h-40 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center group transition-colors hover:border-blue-300">
                {data.image ? (
                  <>
                    <img
                      alt="category preview"
                      src={data.image}
                      className="w-full h-full object-cover rounded-xl"
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                      <span className="text-white text-sm">Change Image</span>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-4">
                    <FiUploadCloud className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">PNG, JPG up to 5MB</p>
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <label
                htmlFor="UploadCategoryImage"
                className={`flex-1 w-full ${
                  !data.name ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                <div
                  className={`px-6 py-3 rounded-lg font-medium text-sm transition-all ${
                    data.name
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {data.image ? "Change Image" : "Select Image"}
                </div>
                <input
                  disabled={!data.name}
                  onChange={handleUploadCategoryImage}
                  type="file"
                  id="UploadCategoryImage"
                  className="hidden"
                  accept="image/*"
                />
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!data.name || !data.image || loading}
            className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all ${
              data.name && data.image
                ? "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
                : "bg-gray-300 cursor-not-allowed"
            } flex items-center justify-center gap-2`}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Adding...
              </>
            ) : (
              "Create Category"
            )}
          </button>
        </form>
      </div>
    </section>
  );
};

export default UploadCategoryModel;