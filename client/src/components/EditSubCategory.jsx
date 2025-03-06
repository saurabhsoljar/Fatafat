import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import uploadImage from "../utils/UploadImage";
import { useSelector } from "react-redux";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";
import PropTypes from "prop-types";

const EditSubCategory = ({ close, refreshData, data }) => {
  const [subCategoryData, setSubCategoryData] = useState({
    _id: data._id,
    name: data.name,
    image: data.image,
    category: data.category || [],
  });
  const [loading, setLoading] = useState(false);
  const allCategory = useSelector((state) => state.product.allCategory);

  //Updates the sub-category name when the input field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSubCategoryData((prev) => ({ ...prev, [name]: value }));
  };

  // Uploads an image to cloud storage and updates the image field in state
  const handleUploadSubCategoryImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      const response = await uploadImage(file);
      if (response?.data?.url || response?.data?.imageUrl) {
        setSubCategoryData((prev) => ({
          ...prev,
          image: response.data.url || response.data.imageUrl,
        }));
      } else if (response?.url) {
        setSubCategoryData((prev) => ({ ...prev, image: response.url }));
      } else {
        toast.error("Invalid image upload response.");
      }
    } catch (error) {
      toast.error("Failed to upload image.");
    } finally {
      setLoading(false);
    }
  };

  //Removes a category from the selected categories list
  const handleRemoveCategorySelected = (categoryId) => {
    setSubCategoryData((prev) => ({
      ...prev,
      category: prev.category.filter((cat) => cat._id !== categoryId),
    }));
  };

  // Submits updated data to the backend and refreshes the parent component
  const handleSubmitSubCategory = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await Axios({
        ...SummaryApi.updateSubCategory,
        data: {
          ...subCategoryData,
          category: subCategoryData.category.map((cat) => cat._id),
        },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        close(); // Closes modal
        refreshData(); // Closes modal
        setSubCategoryData({
          name: "",
          image: "",
          category: [],
        });
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  EditSubCategory.propTypes = {
    close: PropTypes.func.isRequired,
    refreshData: PropTypes.func.isRequired,
  };

  return (
    <section className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6 relative">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3">
          <h1 className="text-lg font-semibold text-gray-800">
            Edit Sub-Category
          </h1>
          <button
            onClick={close}
            className="p-2 rounded-full hover:bg-gray-200 transition"
          >
            <IoClose size={20} />
          </button>
        </div>

        {/* Form */}
        <form className="mt-4 space-y-4" onSubmit={handleSubmitSubCategory}>
          {/* Name Input */}
          <div className="flex flex-col">
            <label htmlFor="name" className="text-gray-700 font-medium">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={subCategoryData.name}
              onChange={handleChange}
              className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="Enter sub-category name"
            />
          </div>

          {/* Image Upload */}
          <div className="flex flex-col space-y-2">
            <label className="text-gray-700 font-medium">Image</label>
            <div className="flex items-center space-x-4">
              <div className="w-24 h-24 border bg-gray-100 flex items-center justify-center rounded-lg overflow-hidden">
                {subCategoryData.image ? (
                  <img
                    src={subCategoryData.image}
                    alt="Subcategory"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm text-gray-400">No Image</span>
                )}
              </div>
              <label
                htmlFor="uploadSubCategoryImage"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-400 transition"
              >
                Upload Image
              </label>
              <input
                type="file"
                id="uploadSubCategoryImage"
                className="hidden"
                onChange={handleUploadSubCategoryImage}
              />
            </div>
          </div>

          {/* Category Selection */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium">Select Category</label>
            <div className="border rounded-lg p-2">
              <div className="flex flex-wrap gap-2">
                {subCategoryData.category.map((cat, index) => (
                  <div
                    key={`${cat._id}-${index}`} // Add index to key
                    className="bg-blue-100 px-2 py-1 flex items-center space-x-2 rounded-lg"
                  >
                    <span className="text-blue-700">{cat.name}</span>
                    <button
                      onClick={() => handleRemoveCategorySelected(cat._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <IoClose />
                    </button>
                  </div>
                ))}
              </div>
              <select
                // In the select element's onChange handler
                onChange={(e) => {
                  const value = e.target.value;
                  const categoryDetails = allCategory.find(
                    (el) => el._id === value
                  );

                  // Check if category is already selected
                  if (
                    categoryDetails &&
                    !subCategoryData.category.some((cat) => cat._id === value)
                  ) {
                    setSubCategoryData((prev) => ({
                      ...prev,
                      category: [...prev.category, categoryDetails],
                    }));
                  }
                }}
                className="w-full mt-2 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition cursor-pointer"
              >
                <option value="">Select Category</option>
                {allCategory.map((category) => (
                  <option value={category._id} key={category._id}>
                    {category?.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button
            className={`w-full py-3 font-semibold text-white rounded-lg transition ${
              subCategoryData.name &&
              subCategoryData.image &&
              subCategoryData.category.length > 0
                ? "bg-blue-600 hover:bg-blue-500"
                : "bg-gray-300 cursor-not-allowed"
            }`}
            disabled={
              !(
                subCategoryData.name &&
                subCategoryData.image &&
                subCategoryData.category.length > 0
              ) || loading
            }
          >
            {loading ? "Adding..." : "Submit"}
          </button>
        </form>
      </div>
    </section>
  );
};

EditSubCategory.propTypes = {
  close: PropTypes.func.isRequired,
  refreshData: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};

export default EditSubCategory;
