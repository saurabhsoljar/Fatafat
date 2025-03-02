import React, { useEffect, useState } from "react";
import UploadCtegoryModel from "../components/UploadCtegoryModel";
import Loading from "../components/Loading";
import NoData from "../components/NoData";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";

const CategoryPage = () => {
  const [openUploadCategory, setOtpUploadCategory] = useState(false);
  const [loading, setLoading] = useState(false);
  const [Categorydata, setDataCategory] = useState([]);

  const fetchCategory = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getCategory,
      });
      const { data: responseData } = response;

      if (responseData.success) {
        setDataCategory(responseData.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  const handleImageError = (event) => {
    event.target.src = "/placeholder-image.png"; // Replace with your placeholder image path
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

      <div className="p-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Categorydata.map((category, index) => (
          <div
            key={index}
            className="w-32 h-48 rounded shadow-md bg-[#edf4ff] flex flex-col items-center justify-center"
          >
            {category.image ? ( // Corrected property name to 'image'
              <img
                alt={category.name}
                src={category.image} // Corrected property name to 'image'
                className="w-full h-3/4 object-contain"
                onError={handleImageError}
              />
            ) : (
              <div className="w-full h-3/4 flex items-center justify-center">
                <p className="text-sm text-gray-500">No Image</p>
              </div>
            )}
            <p className="text-center mt-2">{category.name}</p>
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
    </section>
  );
};

export default CategoryPage;