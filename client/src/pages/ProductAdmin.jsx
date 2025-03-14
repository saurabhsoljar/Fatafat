import React, { useEffect, useState } from 'react';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import Axios from '../utils/Axios';
import Loading from '../components/Loading';
import ProductCardAdmin from '../components/ProductCardAdmin';
import { IoSearchOutline } from 'react-icons/io5';
import { FiPackage } from 'react-icons/fi';

const ProductAdmin = () => {
  const [productData, setProductData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPage, setTotalPage] = useState(1);
  const [search, setSearch] = useState("");

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getProduct,
        data: { page, limit: 12, search },
      });
      const { data: responseData } = response;
      console.log("API Response:", responseData);
      if (responseData.data) {  
        setProductData(responseData.data);
        setTotalPage(responseData.totalPages);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchProductData();
    }, 500);
    return () => clearTimeout(debounceTimer);
  }, [page, search]);

  const handleNext = () => {
    if (page !== totalPage) setPage((prev) => prev + 1);
  };

  const handlePrevious = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleSearchChange = (e) => {
    const { value } = e.target;
    setSearch(value);
    setPage(1);
  };

  useEffect(() => {
    let flag = true
    const interval = setTimeout(() => {
      if (flag) {
        fetchProductData();
        flag = false;
      }
    }, 300);

    return () => {
      clearTimeout(interval);
    };
    
  }, [search]);

  return (
    <section>
      <div className="p-2 font-semibold shadow-md bg-gray-300 flex items-center justify-between rounded">
        <h2 className="font-semibold">Product</h2>
        <div className="h-full max-w-56 min-w-24 w-full ml-auto bg-blue-50 px-4 flex items-center gap-3 py-2 cursor-pointer rounded border focus-within:border-primary-200">
          <input
            type="text"
            placeholder="Search product here..."
            className="h-full w-full rounded-md outline-none"
            value={search}
            onChange={handleSearchChange}
          />
          <IoSearchOutline size={25} />
        </div>
      </div>

      {loading && <Loading />}

      <div className="p-4 bg-blue-50">
        <div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {productData.map((p) => (
              <ProductCardAdmin key={p._id} data={p}
              fetchProductData={fetchProductData}
              />
            ))}
          </div>

          {productData.length === 0 && !loading && (
            <div className="text-center text-gray-500">
              <FiPackage className="inline-block text-4xl mb-2" />
              <p>No products found.</p>
            </div>
          )}
        </div>

        <div className="flex justify-between my-4">
          <button
            onClick={handlePrevious}
            disabled={page === 1}
            className="border border-primary-200 px-4 py-1 hover:bg-primary-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button className="w-full bg-slate-100">
            {page}/{totalPage}
          </button>
          {totalPage > 1 && (
            <button
              onClick={handleNext}
              disabled={page === totalPage}
              className="border border-primary-200 px-4 py-1 hover:bg-primary-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductAdmin;