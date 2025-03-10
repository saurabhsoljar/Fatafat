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
import EditSubCategory from "../components/EditSubCategory";
import ConfirmBox from "../components/ConfirmBox";
import toast from "react-hot-toast";

const SubCategoryPage = () => {
  const [openAddSubCategory, setOpenAddSubCategory] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const columnHelper = createColumnHelper();
  const [ImageURL, setImageURL] = useState("");
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState({
    _id: "",
  });
  const [deleteSubCategory, setDeleteSubCategory] = useState({
    _id: "",
  });
  const [openDeleteConfirmBox, setOpenDeleteConfirmBox] = useState(false);

  const allCategories = useSelector((state) => state.product.allCategory);

  // Fetches sub-categories from API
  const fetchSubCategory = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getSubCategory,
        method: "get",
        params: { _: new Date().getTime() },
      });

      if (response.data.success) {
        setData(response.data.data || []); // Updates sub-category list
      }
    } catch (error) {
      setData([]); // Resets on error
    } finally {
      setLoading(false); // Always stops loading
    }
  };

  useEffect(() => {
    fetchSubCategory();
  }, []);

  const columns = [
    columnHelper.accessor("name", {
      header: "Name",
    }),
    // Image column with clickable preview
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
    // Category display with mapped tags
    columnHelper.accessor("category", {
      header: "Category",
      cell: ({ row }) => {
        return (
          <>
            {row.original.category.map((c, index) => (
              <p
                key={`${c._id}-${index}`}
                className="shadow-md px-1 inline-block"
              >
                {c.name}
              </p>
            ))}
          </>
        );
      },
    }),
    // Action buttons column
    columnHelper.accessor("_id", {
      header: "Action",
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-center gap-3">
            {/* Edit button */}
            <button
              onClick={() => {
                setOpenEdit(true);
                setEditData(row.original);
              }}
              className="p-2 rounded-full bg-green-200 text-green-500 hover:bg-green-300"
            >
              <HiPencil size={20} />
            </button>
            {/* Delete button */}
            <button
              onClick={() => {
                setDeleteSubCategory(row.original);
                setOpenDeleteConfirmBox(true);
              }}
              className="p-2 rounded-full text-red-500 bg-red-200 hover:bg-red-300"
            >
              <MdDelete size={20} />
            </button>
          </div>
        );
      },
    }),
  ];

  // handle Delete SubCategory

  const handleDeleteSubCategory = async () => {
    // Handles sub-category deletion
    try {
      const response = await Axios({
        url: `${SummaryApi.deleteSubCategory.url}/${deleteSubCategory._id}`,
        method: SummaryApi.deleteSubCategory.method,
      });

      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        fetchSubCategory(); // Refresh data
        setOpenDeleteConfirmBox(false); // Close confirmation
        setDeleteSubCategory({ _id: "" }); // Reset deletion target
      }
    } catch (error) {
      AxiosToastError(error); // Handle errors
    }
  };

  return (
    <section>
      {/* Header Section */}
      <div className="p-2 font-semibold shadow-md bg-gray-300 flex items-center justify-between rounded">
        <h2 className="font-semibold">Sub Category</h2>
        <button
          onClick={() => setOpenAddSubCategory(true)}
          className="text-sm border border-primary-200 hover:bg-primary-200 rounded"
        >
          Add Sub Category
        </button>
      </div>

      {/* Data Table */}
      <div className="overflow-auto w-full max-w-[95vw]">
        <DisplayTable data={data} columns={columns} />
      </div>
      {/* Modals */}
      {openAddSubCategory && (
        <UploadSubCategoryModel
          close={() => setOpenAddSubCategory(false)}
          refreshData={fetchSubCategory}
        />
      )}

      {ImageURL && <ViewImage url={ImageURL} close={() => setImageURL("")} />}

      {openEdit && (
        <EditSubCategory
          data={editData}
          close={() => setOpenEdit(false)}
          refreshData={fetchSubCategory}
        />
      )}

      {openDeleteConfirmBox && (
        <ConfirmBox
          cancel={() => setOpenDeleteConfirmBox(false)}
          close={() => setOpenDeleteConfirmBox(false)}
          confirm={handleDeleteSubCategory}
          refreshData={fetchSubCategory}
        />
      )}
    </section>
  );
};

export default SubCategoryPage;
