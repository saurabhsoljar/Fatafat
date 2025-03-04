import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import uploadImage from "../utils/UploadImage";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";

const EditCategory = ({ close, fetchData, data:CategoryData }) => {

  // State management for category data and loading status
  const [data, setData] = useState({
    _id : CategoryData._id,
    name: CategoryData.name,
    image: CategoryData.image,
  });
  const [loading, setLoading] = useState(false);

  /**
   * Handles text input changes for category name
   * @param {Object} e - Event object from input field
   */
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Handles form submission for creating new category
   * 1. Validates category name
   * 2. Sends POST request to create category
   * 3. Handles success/error responses
   * 4. Closes modal and refreshes category list
   * @param {Object} e - Event object from form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation check
    if (!data.name.trim()) {
      toast.error("Please enter a category name.");
      return;
    }

    setLoading(true);
    try {
      // API call to create category
      const response = await Axios({
        ...SummaryApi.updateCategory,
        data: data,
      });

      const { data: responseData } = response;
      if (responseData.success) {
        toast.success(responseData.message);
        close();
        
        // Refresh parent component's category list
        if (typeof fetchData === "function") {
          fetchData();
        }
      } else {
        toast.error(responseData.message || "Something went wrong.");
        fetchData();
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles image upload for category
   * 1. Accepts image file from input
   * 2. Uploads image to cloud storage
   * 3. Updates state with image URL
   * @param {Object} e - Event object from file input
   */
  const handleUploadCategoryImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // setLoading(true)
    try {
      setLoading(true);
      // Upload image to cloud service
      const response = await uploadImage(file);
      console.log("Image upload response:", response);

      // Handle different response formats
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
    <section className="fixed top-0 bottom-0 left-0 right-0 bg-neutral-800 bg-opacity-60 flex items-center justify-center">
          <div className="bg-white max-w-4xl w-full p-4 rounded">
            {/* Modal header with close button */}
            <div className="flex items-center justify-between">
              <h1 className="font-semibold">Update Category</h1>
              <button onClick={close} className="w-fit block ml-auto">
                <IoClose />
              </button>
            </div>
    
            {/* Category form */}
            <form className="my-3 grid gap-2" onSubmit={handleSubmit}>
              {/* Name input section */}
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
    
              {/* Image upload section */}
              <div className="grid gap-1">
                <p>Image</p>
                <div className="flex gap-3 flex-col lg:flex-row items-center">
                  {/* Image preview area */}
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
                  
                  {/* Image upload button */}
                  <label htmlFor="UploadCategoryImage">
                    <div className={`${!data.name ? "bg-gray-400" : "bg-primary-200"} px-4 py-2 rounded cursor-pointer`}>
                      {
                        loading ? "Loading...." : " Upload Image "
                      }
                      
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
    
              {/* Submit button with loading state */}
              <button
                className={`${
                  data.name && data.image
                    ? "bg-primary-200 hover:bg-primary-100"
                    : "bg-slate-200"
                } py-2 font-semibold`}
                disabled={!(data.name && data.image) || loading}
              >
                {loading ? "Adding..." : "Update Category"}
              </button>
            </form>
          </div>
        </section>
  )
}

export default EditCategory