import React, { useEffect, useState } from "react";
import UploadCtegoryModel from "../components/UploadCtegoryModel";
import Loading from "../components/Loading";
import NoData from "../components/NoData";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import EditCategory from "../components/EditCategory";
import ConfirmBox from "../components/ConfirmBox";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";
import { useSelector,useDispatch } from "react-redux";
import { setAllCategory } from "../store/productSlice";


const CategoryPage = () => {
  const dispatch = useDispatch();
  const [openUploadCategory, setOtpUploadCategory] = useState(false);
  const [loading, setLoading] = useState(false);
  const [Categorydata, setDataCategory] = useState([]);
  const [OpenEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    image: "",
  });
  const [openConfirmBoxDelete, setopenConfirmBoxDelete] = useState(false);
  const [deleteCategory, setdeleteCategory] = useState({
    _id: "",
  });


  const allCategory = useSelector(state =>state.product.allCategory)

  useState(()=>{
    setDataCategory(allCategory)
  },[allCategory])
  
  const fetchCategory = async () => {
    try {
      setLoading(true);
      const response = await Axios({ ...SummaryApi.getCategory });
      const { data: responseData } = response;

      if (responseData.success) {
        dispatch(setAllCategory(responseData.data));
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    setDataCategory(allCategory)
  },[allCategory])

  // const fetchCategory = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await Axios({
  //       ...SummaryApi.getCategory,
  //     });
  //     const { data: responseData } = response;

  //     if (responseData.success) {
  //       setDataCategory(responseData.data);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching categories:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchCategory();
  // }, []);

  const handleDeleteCategory = async()=>{
    try {
        const response = await Axios({
            ...SummaryApi.deleteCategory,
            data : deleteCategory
        })

        const { data : responseData } = response

        if(responseData.success){
            toast.success(responseData.message)
            fetchCategory()
            setopenConfirmBoxDelete(false)
        }
    } catch (error) {
        AxiosToastError(error)
    }
}



  // const handleImageError = (event) => {
  //   event.target.src = "/placeholder-image.png";  
  // };

  const handleImageError = (event) => {
    event.target.src = "/placeholder-image.png";
    event.target.onerror = null; // Prevent infinite loop
  };

  return (
    <section>
      <div className="p-2 font-semibold shadow-md bg-gray-300 flex items-center justify-between rounded">
        <h2 className="font-semibold">Category</h2>
        <button
          onClick={() => setOtpUploadCategory(true)}
          className="text-sm border border-primary-200 hover:bg-primary-200 rounded"
        >
          Add Category
        </button>
      </div>
      {Categorydata.length === 0 && !loading && <NoData />}
      <div className="p-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 ">
        {allCategory.map((category, index) => (
          <div
            key={index}
            className="relative w-32 h-48 rounded-lg shadow-md bg-[#edf4ff] flex flex-col items-center justify-center group transition-all duration-300 hover:shadow-lg hover:bg-[#e2ebff]"
          >
            {/* Category Image */}
            {category.image ? (
              <img
                alt={category.name}
                src={category.image}
                className="w-full h-3/4 object-contain p-2"
                onError={handleImageError}
              />
            ) : (
              <div className="w-full h-3/4 flex items-center justify-center">
                <p className="text-sm text-gray-500">No Image</p>
              </div>
            )}

            {/* Category Name */}
            <p className="text-center mt-2 font-medium text-gray-700">
              {category.name}
            </p>

            {/* Action Buttons */}
            <div className="absolute bottom-0 left-0 right-0 h-[30%] bg-white/90 backdrop-blur-sm rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2 p-1">
              <button
                onClick={() => {
                  setOpenEdit(true);
                  setEditData(category);
                }}
                className="flex items-center justify-center gap-1 px-2 py-0.5 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 transition-all duration-200 hover:scale-105 shadow-sm flex-1"
              >
                <FiEdit className="w-4 h-4" />
                <span>Edit</span>
              </button>

              <button
                onClick={() => {
                  setopenConfirmBoxDelete(true);
                  setdeleteCategory(category);
                }}
                className="flex items-center justify-center gap-1 px-2 py-0.5 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition-all duration-200 hover:scale-105 shadow-sm flex-1"
              >
                <FiTrash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
      {loading && <Loading />}
      {openUploadCategory && (
        <UploadCtegoryModel
          fetchData={fetchCategory}
          close={() => setOtpUploadCategory(false)}
        />
      )}
      {OpenEdit && (
        <EditCategory
          data={editData}
          close={() => setOpenEdit(false)}
          fetchData={fetchCategory}
        />
      )}
      
      {openConfirmBoxDelete && (
        <ConfirmBox
          close={() => {
            setopenConfirmBoxDelete(false);
            setdeleteCategory({ _id: "" });  
          }}
          cancel={() => {
            setopenConfirmBoxDelete(false);
            setdeleteCategory({ _id: "" });  
          }}
          confirm={handleDeleteCategory}
        />
      )}
    </section>
  );
};

export default CategoryPage;
