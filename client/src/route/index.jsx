import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import SeaechPage from "../pages/SeaechPage";
import Register from "../pages/Register";
import Login from "../pages/Login";
import ForgotPassword from "../pages/ForgotPassword";
import OtpVerification from "../pages/OtpVerification";
import ResetPassword from "../pages/ResetPassword";
import UserMenuMobile from "../pages/UserMenuMobile";
import Dashboard from "../layouts/Dashboard";
import Profile from "../pages/Profile";
import MyOrders from "../pages/MyOrders";
import Address from "../pages/Address";
import CategoryPage from "../pages/CategoryPage";
import SubCategoryPage from "../pages/SubCategoryPage";
import UploadProduct from "../pages/UploadProduct";
import ProductAdmin from "../pages/ProductAdmin";
import AdminPermision from "../layouts/AdminPermision";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "/search",
        element: <SeaechPage />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "verification-otp",
        element: <OtpVerification />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
      {
        path: "user",
        element: <UserMenuMobile />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
        children: [
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "myorders",
            element: <MyOrders />,
          },
          {
            path: "address",
            element: <Address />,
          },
          {
            path: "category",
            element: (
              <AdminPermision>
                <CategoryPage />
              </AdminPermision>
            ),
          },
          {
            path: "subcategory",
            element: (
              <AdminPermision>
                <SubCategoryPage />
              </AdminPermision>
            ),
          },
          {
            path: "upload-product",
            element: (
              <AdminPermision>
                <UploadProduct />
              </AdminPermision>
            ),
          },
          {
            path: "product",
            element: (
              <AdminPermision>
                <ProductAdmin />
              </AdminPermision>
            ),
          },
        ],
      },
    ],
  },
]);

export default router;
