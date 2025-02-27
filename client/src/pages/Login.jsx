import React, { useState } from "react";
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import { Link, useNavigate } from "react-router-dom";
import fetchUserDetails from "../utils/fetchUserDetails";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../store/userSlice";

const Login = () => {
  // useState Hooks
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch()

  // handleChange Function
  // This function updates the state 'data' with the values entered in the input fields.
  const handleChange = (e) => {
    const { name, value } = e.target;

    setData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };

  // valideValue Variable
  // This variable checks if all the fields in the 'data' state are filled.
  const valideValue = Object.values(data).every((el) => el);

  // handleSubmit Function
  // This function handles the form submission.
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make an API call to register the user
      const response = await Axios({
        ...SummaryApi.login,
        data: data,
      });

      // Handle API response
      if (response.data.error) {
        toast.error(response.data.message);
      }

      if (response.data.success) {
        toast.success(response.data.message);
        localStorage.setItem("accessToken", response.data.data.accessToken);
        localStorage.setItem("refreshToken", response.data.data.refreshToken);

        const useDetails = await fetchUserDetails()
        dispatch(setUserDetails(useDetails.data))

        setData({
          email: "",
          password: "",
        });
        navigate("/");
      }
    } catch (error) {
      // Handle API errors using AxiosToastError utility
      AxiosToastError(error);
    }
  };

  // Render Function
  return (
    <section className="w-full container mx-auto px-2">
      <div className="bg-white my-4 w-full max-w-lg mx-auto rounded-lg p-8 shadow-xl">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-4xl font-extrabold text-center mb-2">
            <span className="text-gray-800">Fata</span>
            <span className="text-green-600 relative">
              Fat
              <span className="absolute -right-4 -top-2 text-green-500 text-2xl">
                •
              </span>
            </span>
          </h1>
          <p className="text-lg text-gray-600 font-medium">
            Join the Quick Commerce Revolution
          </p>
        </div>

        <form className="grid gap-4  py-2" onSubmit={handleSubmit}>
          <div className="grid gap-1">
            <label htmlFor="email">Email :</label>
            <input
              type="email"
              id="email"
              className="bg-blue-50 p-2 border rounded outline-none focus:border-primary-200"
              name="email"
              value={data.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="password">Password :</label>
            <div className="bg-blue-50 p-2 border rounded flex items-center focus-within:border-primary-200">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="w-full outline-none"
                name="password"
                value={data.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
              <div
                onClick={() => setShowPassword((preve) => !preve)}
                className="cursor-pointer"
              >
                {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </div>
            </div>
            <Link
              to={"/forgot-password"}
              className="block ml-auto text-green-600 hover:text-green-800 transition-colors duration-300"
            >
              Forgot password?
            </Link>
          </div>

          <button
            disabled={!valideValue}
            className={` ${
              valideValue ? "bg-green-800 hover:bg-green-700" : "bg-gray-500"
            }  text-white py-2 rounded font-semibold my-3 tracking-wide`}
          >
            Login
          </button>
        </form>

        <p>
          Don't have account ?{" "}
          <Link
            to={"/register"}
            className="font-semibold text-green-700 hover:text-green-800"
          >
            Register
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
