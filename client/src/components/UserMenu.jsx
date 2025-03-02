import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiPackage,
  FiMapPin,
  FiLogOut,
  FiChevronRight,
} from "react-icons/fi";
import Divider from "./Divider";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { logout } from "../store/userSlice";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";
import { HiExternalLink } from "react-icons/hi";


const UserMenu = ({ close }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.logout,
      });

      if (response.data.success) {
        if (close) {
          close();
        }
        dispatch(logout());
        localStorage.clear();
        toast.success(response.data.message);
        navigate("/");
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <div className=" bg-white  rounded-lg shadow-xl p-4">
      {/* Profile Section */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
          <FiUser className="text-blue-600 text-xl" />
        </div>
        <div className="flex-1">
          <div className="mb-4">
            <div className="text-sm text-gray-500 mb-1">My Account</div>
            <div className="font-semibold text-gray-800 truncate flex items-baseline gap-2 group">
              <span className="truncate">{user.name || "Welcome User"}</span>
              <Link
                to={"/dashboard/profile"}
                onClick={close}
                className="hover:bg-gray-100 p-1 rounded-md transition-all duration-200 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <HiExternalLink
                  size={20}
                  className="inline-block align-middle relative top-0.5 md:top-auto"
                  aria-label="Edit profile"
                />
              </Link>
            </div>
          </div>
          {user.mobile && (
            <div className="text-xs text-gray-500 mt-1">
              +91 ••••• •{user.mobile.toString().slice(-4)}
            </div>
          )}
          {user.email && (
            <div className="text-xs text-gray-500 truncate mt-1">
              {user.email}
            </div>
          )}
          {!user.mobile && (
            <div className="text-xs text-gray-500 mt-1">Login/Sign Up</div>
          )}
        </div>
      </div>

      <Divider />

      {/* Menu Items */}
      <div className="space-y-2 mt-3">

        {/* Category */}
        <Link
          to="/dashboard/Category"
          onClick={close}
          className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
        >
          <div className="flex items-center gap-2">
            <FiPackage className="text-gray-600" />
            <span className="text-sm">Category</span>
          </div>
          <FiChevronRight className="text-gray-400" />
        </Link>

        {/* Sub-Category */}
        <Link
          to="/dashboard/SubCategory"
          onClick={close}
          className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
        >
          <div className="flex items-center gap-2">
            <FiPackage className="text-gray-600" />
            <span className="text-sm">Sub Category</span>
          </div>
          <FiChevronRight className="text-gray-400" />
        </Link>

        {/* Upload Product */}
        <Link
          to="/dashboard/Upload-product"
          onClick={close}
          className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
        >
          <div className="flex items-center gap-2">
            <FiPackage className="text-gray-600" />
            <span className="text-sm">Upload Product</span>
          </div>
          <FiChevronRight className="text-gray-400" />
        </Link>

        {/* Product */}
        <Link
          to="/dashboard/product"
          onClick={close}
          className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
        >
          <div className="flex items-center gap-2">
            <FiPackage className="text-gray-600" />
            <span className="text-sm">Product</span>
          </div>
          <FiChevronRight className="text-gray-400" />
        </Link>

        <Link
          to="/dashboard/myorders"
          onClick={close}
          className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
        >
          <div className="flex items-center gap-2">
            <FiPackage className="text-gray-600" />
            <span className="text-sm">My Orders</span>
          </div>
          <FiChevronRight className="text-gray-400" />
        </Link>

        <Link
          to="/dashboard/address"
          onClick={close}
          className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
        >
          <div className="flex items-center gap-2">
            <FiMapPin className="text-gray-600" />
            <span className="text-sm">Saved Addresses</span>
          </div>
          <FiChevronRight className="text-gray-400" />
        </Link>
      </div>

      <Divider />

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full mt-4 flex items-center gap-2 p-2 text-red-600 hover:bg-red-50 rounded-lg"
      >
        <FiLogOut className="text-lg" />
        <span className="text-sm font-medium">Log Out</span>
      </button>
    </div>
  );
};

export default UserMenu;
