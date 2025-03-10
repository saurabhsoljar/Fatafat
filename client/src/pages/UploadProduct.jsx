import React, { useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from "../utils/UploadImage";
import Loading from "../components/Loading";
import ViewImage from "../components/ViewImage";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import { IoClose } from "react-icons/io5";
import AddFieldComponent from "../components/AddFieldComponent";

const UploadProduct = () => {
  const [data, setData] = useState({
    name: "",
    image: [],
    category: [],
    subCategory: [],
    unit: "",
    stock: "",
    price: "",
    discount: "",
    description: "",
    more_details: {},
    publish: true,
  });

  const [imageLoading, setImageLoading] = useState(false);
  const [ViewImageURL, setViewImageURL] = useState("");
  const allCategory = useSelector((state) => state.product.allCategory);
  const [selectCategory, setSelectCategory] = useState("");
  const [selectSubCategory, setSelectSubCategory] = useState("");
  const AllSubCategory = useSelector((state) => state.product.allSubCategory);
  const [openAddField, setOpenAddField] = useState(false);
  const [fieldName, setFieldName] = useState("");

  const handleAddToArray = (arrayName, value, setArrayName) => {
    if (data[arrayName].some((item) => item._id === value._id)) {
      alert(`${arrayName} already added.`);
      return;
    }
    setData((prev) => ({
      ...prev,
      [arrayName]: [...prev[arrayName], value],
    }));
    setArrayName("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((preve) => ({
      ...preve,
      [name]: value,
    }));
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageLoading(true);
    try {
      const response = await uploadImage(file);
      console.log("Upload Response:", response);

      const imageUrl =
        response?.data?.url || response?.data?.data?.url || response?.url;

      if (!imageUrl) {
        throw new Error("Image URL not found in response");
      }
      if (!file.type.startsWith("image/")) {
        alert("Please upload a valid image file (e.g., JPEG, PNG).");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB.");
        return;
      }

      setData((prev) => ({
        ...prev,
        image: [...prev.image, imageUrl],
      }));
    } catch (error) {
      console.error("Image upload failed:", error);
    }
    setImageLoading(false);
  };

  const handleDeleteImage = (index) => {
    setData((prev) => ({
      ...prev,
      image: prev.image.filter((_, i) => i !== index),
    }));
  };

  const handleRemoveCategory = (index) => {
    setData((prev) => ({
      ...prev,
      category: prev.category.filter((_, i) => i !== index),
    }));
  };

  const handleRemoveSubCategory = (index) => {
    setData((prev) => ({
      ...prev,
      subCategory: prev.subCategory.filter((_, i) => i !== index),
    }));
  };

  const handleAddField = () => {
    setData((prev) => ({
      ...prev,
      more_details: {
        ...prev.more_details,
        [fieldName]: "",
      },
    }));
    setFieldName("");
    setOpenAddField(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!data.name || !data.description || !data.image.length) {
      alert("Please fill all required fields.");
      return;
    }
    if (isNaN(data.price) || isNaN(data.stock) || isNaN(data.discount)) {
      alert("Price, stock, and discount must be valid numbers.");
      return;
    }
    console.log("data", data);
  };

  return (
    <section>
      <div className="p-2 font-semibold shadow-md bg-gray-300 flex items-center justify-between rounded">
        <h2 className="font-semibold">Upload Product</h2>
      </div>
      <div className="grid p-3">
        <form action="" className="grid gap-4" onSubmit={handleSubmit}>
          {/* Name */}
          <div className="grid gap-1">
            <label className="font-semibold" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Enter product name"
              value={data.name}
              onChange={handleChange}
              required
              className="bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded"
            />
          </div>

          {/* Description */}
          <div className="grid gap-1">
            <label className="font-semibold" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Enter product Description"
              value={data.description}
              onChange={handleChange}
              required
              rows={3}
              className="bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded resize-none"
            />
          </div>

          {/* Image Upload */}
          <div>
            <p className="font-semibold">Image</p>
            <div>
              <label
                htmlFor="productImage"
                className="bg-blue-50 h-24 border rounded flex justify-center items-center cursor-pointer"
              >
                <div className="text-center flex justify-center items-center flex-col">
                  {imageLoading ? (
                    <Loading />
                  ) : (
                    <>
                      <FaCloudUploadAlt size={35} />
                      <p>Upload Image</p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  id="productImage"
                  className="hidden"
                  accept="image/*"
                  onChange={handleUploadImage}
                />
              </label>
              {/* Display uploaded images */}
              <div className="flex flex-wrap gap-4">
                {data.image.map((img, index) => (
                  <div
                    key={index}
                    className="h-20 mt-1 w-20 min-w-20 bg-blue-50 border relative group"
                  >
                    <img
                      src={img}
                      alt={img}
                      className="w-full h-full object-scale-down cursor-pointer"
                      onClick={() => setViewImageURL(img)}
                    />
                    <div
                      onClick={() => handleDeleteImage(index)}
                      className="absolute bottom-0 right-0 p-1 bg-red-500 text-white hover:bg-red-600 rounded hidden group-hover:block cursor-pointer"
                      aria-label="Delete Image"
                    >
                      <MdDelete />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Category */}
          <div className="grid gap-1 width-full">
            <label className="font-semibold" htmlFor="">
              Category
            </label>
            <div>
              <select
                value={selectCategory}
                onChange={(e) => {
                  const value = e.target.value;
                  const category = allCategory.find((el) => el._id === value);
                  if (category) {
                    handleAddToArray("category", category, setSelectCategory);
                  }
                }}
                className="bg-blue-50 border w-full p-2 rounded cursor-pointer"
              >
                <option value={""}>Select Category</option>
                {allCategory.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <div className="flex flex-wrap gap-3">
                {data.category.map((c, index) => (
                  <div
                    key={c._id}
                    className="px-3 py-1 flex items-center gap-1 bg-blue-100 rounded-full text-sm mt-2"
                  >
                    <p>{c.name}</p>
                    <div
                      onClick={() => handleRemoveCategory(index)}
                      className="hover:text-red-500 cursor-pointer"
                    >
                      <IoClose size={20} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sub-Category */}
          <div className="grid gap-1 width-full">
            <label className="font-semibold">Sub Category</label>
            <div>
              <select
                value={selectSubCategory}
                onChange={(e) => {
                  const value = e.target.value;
                  const subCategory = AllSubCategory.find(
                    (el) => el._id === value
                  );
                  if (subCategory) {
                    handleAddToArray(
                      "subCategory",
                      subCategory,
                      setSelectSubCategory
                    );
                  }
                }}
                className="bg-blue-50 border w-full p-2 rounded cursor-pointer"
              >
                <option value={""}>Select Sub Category</option>
                {AllSubCategory.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <div className="flex flex-wrap gap-3 mt-2">
                {data.subCategory.map((sc, index) => (
                  <div
                    key={sc._id}
                    className="px-3 py-1 flex items-center gap-1 bg-blue-100 rounded-full text-sm"
                  >
                    <p>{sc.name}</p>
                    <div
                      className="hover:text-red-500 cursor-pointer ml-1"
                      onClick={() => handleRemoveSubCategory(index)}
                    >
                      <IoClose size={20} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Unit */}
          <div className="grid gap-1">
            <label className="font-semibold" htmlFor="unit">
              Unit
            </label>
            <input
              id="unit"
              type="text"
              name="unit"
              placeholder="Enter product unit"
              value={data.unit}
              onChange={handleChange}
              required
              className="bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded"
            />
          </div>

          {/* Stock */}
          <div className="grid gap-1">
            <label className="font-semibold" htmlFor="stock">
              Number of Stock
            </label>
            <input
              id="stock"
              type="number"
              name="stock"
              placeholder="Enter product stock"
              value={data.stock}
              onChange={handleChange}
              required
              className="bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded"
            />
          </div>

          {/* Price */}
          <div className="grid gap-1">
            <label className="font-semibold" htmlFor="price">
              Price
            </label>
            <input
              id="price"
              type="number"
              name="price"
              placeholder="Enter product price"
              value={data.price}
              onChange={handleChange}
              required
              className="bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded"
            />
          </div>

          {/* Discount */}
          <div className="grid gap-1">
            <label className="font-semibold" htmlFor="discount">
              Discount
            </label>
            <input
              id="discount"
              type="number"
              name="discount"
              placeholder="Enter product discount"
              value={data.discount}
              onChange={handleChange}
              required
              className="bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded"
            />
          </div>

          {/* Add more fields */}
          <div>
            {Object.keys(data?.more_details || {}).map((k, index) => (
              <div key={index} className="grid gap-1">
                <label htmlFor={k}>{k}</label>
                <input
                  id={k}
                  type="text"
                  name={k}
                  placeholder={`Enter ${k}`}
                  value={data?.more_details[k]}
                  onChange={(e) => {
                    setData((prev) => ({
                      ...prev,
                      more_details: {
                        ...prev.more_details,
                        [k]: e.target.value,
                      },
                    }));
                  }}
                  required
                  className="bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded"
                />
              </div>
            ))}
          </div>

          {/* Add Fields Button */}
          <div
            onClick={() => setOpenAddField(true)}
            className="hover:bg-primary-200 bg-white py-1 px-3 w-32 text-center font-semibold border-primary-200 hover:text-neutral-900 cursor-pointer rounded border"
          >
            Add Fields
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-primary-100 hover:bg-primary-200 py-2 rounded w-full font-semibold"
          >
            Submit
          </button>
        </form>
      </div>

      {/* View Image Modal */}
      {ViewImageURL && (
        <ViewImage url={ViewImageURL} close={() => setViewImageURL("")} />
      )}

      {/* Add Field Modal */}
      {openAddField && (
        <AddFieldComponent
          value={fieldName}
          onChange={(e) => setFieldName(e.target.value)}
          submit={handleAddField}
          close={() => setOpenAddField(false)}
        />
      )}
    </section>
  );
};

export default UploadProduct;