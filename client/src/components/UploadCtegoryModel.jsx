

import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import uploadImage from "../utils/UploadImage";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";

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
        fetchData();
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

      if (response && response.data && (response.data.url || response.data.imageUrl)) {
        setData((prev) => ({
          ...prev,
          image: response.data.url || response.data.imageUrl,
        }));
      } else if (response && response.url) {
        setData((prev) => ({...prev, image: response.url}));
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
    <section className="fixed top-0 bottom-0 left-0 right-0 bg-neutral-800 bg-opacity-60 flex items-center justify-center">
      <div className="bg-white max-w-4xl w-full p-4 rounded">
        <div className="flex items-center justify-between">
          <h1 className="font-semibold">Category</h1>
          <button onClick={close} className="w-fit block ml-auto">
            <IoClose />
          </button>
        </div>

        <form className="my-3 grid gap-2" onSubmit={handleSubmit}>
          <div className="grid gap-1">
            <label htmlFor="categoryName">Name</label>
            <input
              type="text"
              id="categoryName"
              placeholder="Enter category name"
              value={data.name}
              name="name"
              onChange={handleOnChange}
              className="bg-blue-50 p-2 border border-blue-100 focus-within:border-primary-200 outline-none rounded"
            />
          </div>

          <div className="grid gap-1">
            <p>Image</p>
            <div className="flex gap-3 flex-col lg:flex-row items-center">
              <div className="border bg-blue-50 h-36 w-full lg:w-36 flex items-center justify-center">
                {data.image ? (
                  <img
                    alt="category"
                    src={data.image}
                    className="w-full h-full object-scale-down"
                  />
                ) : (
                  <p className="text-sm text-neutral-500">No Image</p>
                )}
              </div>
              <label htmlFor="UploadCategoryImage">
                <div
                  className={`${!data.name ? "bg-gray-400" : "bg-primary-200"} px-4 py-2 rounded cursor-pointer`}
                >
                  Upload Image
                </div>
                <input
                  disabled={!data.name}
                  onChange={handleUploadCategoryImage}
                  type="file"
                  id="UploadCategoryImage"
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <button
            className={`${data.name && data.image ? "bg-primary-200 hover:bg-primary-100" : "bg-slate-200"} py-2 font-semibold`}
            disabled={!(data.name && data.image) || loading}
          >
            {loading ? "Adding..." : "Add Category"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default UploadCategoryModel;