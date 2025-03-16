import React, { useEffect, useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from "../utils/UploadImage";
import Loading from "../components/Loading";
import ViewImage from "../components/ViewImage";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import { IoClose } from "react-icons/io5";
import AddFieldComponent from "../components/AddFieldComponent";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import successAlert from "../utils/SuccessAlert";

const EditProductAdmin = ({ close, data: propsData, fetchProductData }) => {
  const [data, setData] = useState({
    _id: propsData._id,
    name: propsData.name,
    image: propsData.image,
    category: propsData.category,
    subCategory: propsData.subCategory,
    unit: propsData.unit,
    stock: propsData.stock,
    price: propsData.price,
    discount: propsData.discount,
    description: propsData.description,
    more_details: propsData.more_details || {},
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
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    // Check if adding these files exceeds the limit
    if (data.image.length + files.length > 10) {
      alert("You can upload a maximum of 10 images.");
      return;
    }

    setImageLoading(true);

    try {
      const uploadedImages = await Promise.all(
        files.map(async (file) => {
          if (!file.type.startsWith("image/")) {
            alert("Please upload only valid image files.");
            return null;
          }
          if (file.size > 5 * 1024 * 1024) {
            alert("File size should be less than 5MB.");
            return null;
          }
          if (file.size === 0) {
            alert("File size should be greater than 0.");
            return null;
          }

          const response = await uploadImage(file);
          return (
            response?.data?.url || response?.data?.data?.url || response?.url
          );
        })
      );

      // Filter out failed uploads (null values)
      const validImages = uploadedImages.filter(Boolean);

      setData((prev) => ({
        ...prev,
        image: [...prev.image, ...validImages],
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm(data);
    if (Object.keys(errors).length > 0) {
      alert(Object.values(errors).join("\n"));
      return;
    }

    try {
      const response = await Axios({
        ...SummaryApi.updateProductDetails,
        data: data,
      });
      const { data: responseData } = response;

      if (responseData.success) {
        successAlert(responseData.message);
        if (close) {
          close();
        }
        fetchProductData();
        setData({
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
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const validateForm = (data) => {
    const errors = {};

    if (!data.name || data.name.length < 3) {
      errors.name = "Product name must be at least 3 characters long.";
    }
    if (!data.description || data.description.length < 10) {
      errors.description = "Description must be at least 10 characters long.";
    }
    if (data.image.length === 0) {
      errors.image = "Please upload at least one image.";
    }
    if (data.category.length === 0) {
      errors.category = "Please select at least one category.";
    }
    if (data.subCategory.length === 0) {
      errors.subCategory = "Please select at least one sub-category.";
    }
    if (data.price <= 0 || data.stock <= 0 || data.discount < 0) {
      errors.price = "Price, stock, and discount must be greater than 0.";
    }
    if (data.discount > data.price) {
      errors.discount = "Discount cannot be greater than the price.";
    }
    if (data.discount > 100) {
      errors.discount = "Discount cannot be greater than 100%.";
    }
    if (Object.keys(data.more_details).length === 0) {
      errors.more_details = "Please add at least one more detail.";
    }

    return errors;
  };

  return (
    <section className="fixed top-0 right-0 left-0 bottom-0 bg-black z-50 bg-opacity-70 p-4">
      <div className="bg-white w-full p-4 max-w-2xl mx-auto rounded overflow-y-auto h-full max-h-[95vh]">
        <section>
          <div className="p-2 font-semibold shadow-md bg-gray-300 flex items-center justify-between rounded">
            <h2 className="font-semibold ">Update Product</h2>
            <IoClose size={20} onClick={close} className=" cursor-pointer" />
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
                      multiple
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
                      const category = allCategory.find(
                        (el) => el._id === value
                      );
                      if (category) {
                        handleAddToArray(
                          "category",
                          category,
                          setSelectCategory
                        );
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
                Update Product
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
      </div>
    </section>
  );
};

export default EditProductAdmin;
