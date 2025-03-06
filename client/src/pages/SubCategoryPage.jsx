import React, { useEffect, useState } from "react";
import UploadSubCategoryModel from "../components/UploadSubCategoryModel";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import DisplayTable from "../components/DisplayTable";
import { createColumnHelper } from "@tanstack/react-table";
import ViewImage from "../components/ViewImage";
import { HiPencil } from "react-icons/hi";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";

const SubCategoryPage = () => {
  const [openAddSubCategory, setOpenAddSubCategory] = useState(false);
  const [data, setData] = useState([]); // Initialize with empty array
  const [loading, setLoading] = useState(false);
  const columnHelper = createColumnHelper();
  const [ImageURL, setImageURL] = useState("");

  const allCategories = useSelector((state) => state.product.allCategory);

  // SubCategoryPage.js
  const fetchSubCategory = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getSubCategory,
        method: "get",
        params: { _: new Date().getTime() }, // Cache buster
      });

      if (response.data.success) {
        setData(
          (prev) =>
            JSON.stringify(prev) === JSON.stringify(response.data.data)
              ? prev // Keep previous reference if same data
              : response.data.data || [] // New reference if data changed
        );
      }
    } catch (error) {
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubCategory();
  }, []);

  const columns = [
    columnHelper.accessor("name", {
      header: "Name",
    }),
    columnHelper.accessor("image", {
      header: "Image",
      cell: ({ row }) => (
        <div className="flex justify-center items-center">
          <img
            src={row.original.image}
            alt={row.original.name}
            className="w-8 h-8 cursor-pointer"
            onClick={() => {
              setImageURL(row.original.image);
            }}
          />
        </div>
      ),
    }),
    columnHelper.accessor("category", {
      header: "Category",
      cell: ({ row }) => {
        return (
          <>
            {row.original.category.map((c) => (
              <p key={c._id} className="shadow-md px-1 inline-block">
                {c.name}
              </p>
            ))}
          </>
        );
      },
    }),
    columnHelper.accessor("_id", {
      header: "Action",
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-center gap-3">
            <button className="p-2 rounded-full bg-green-200 text-green-500 hover:bg-green-300">
              <HiPencil size={20} />
            </button>
            <button className="p-2 rounded-full text-red-500 bg-red-200 hover:bg-red-300">
              <MdDelete size={20} />
            </button>
          </div>
        );
      },
    }),
  ];

  return (
    <section>
      <div className="p-2 font-semibold shadow-md bg-gray-300 flex items-center justify-between rounded">
        <h2 className="font-semibold">Sub Category</h2>
        <button
          onClick={() => setOpenAddSubCategory(true)}
          className="text-sm border border-primary-200 hover:bg-primary-200 rounded"
        >
          Add Sub Category
        </button>
      </div>

      <div>
        <DisplayTable
          data={data} // Now properly initialized
          columns={columns}
        />
      </div>

      {openAddSubCategory && (
        <UploadSubCategoryModel
          close={() => setOpenAddSubCategory(false)}
          refreshData={fetchSubCategory}
        />
      )}

      {ImageURL && <ViewImage url={ImageURL} close={() => setImageURL("")} />}
    </section>
  );
};

export default SubCategoryPage;
