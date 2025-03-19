import React, { useState } from "react";
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  // useState Hooks
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

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

    // Check if password and confirm password match
    if (data.password !== data.confirmPassword) {
      toast.error("password and confirm password must be same");
      return;
    }

    try {
      // Make an API call to register the user
      const response = await Axios({
        ...SummaryApi.register,
        data: data,
      });

      // Handle API response
      if (response.data.error) {
        toast.error(response.data.message);
      }

      if (response.data.success) {
        toast.success(response.data.message);
        setData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        navigate("/login");
      }
    } catch (error) {
      // Handle API errors using AxiosToastError utility
      AxiosToastError(error);
    }
  };

  // Render Function
  return (
    <section className="w-full container mx-auto px-2 mt-40">
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

        <form className="grid gap-4 mt-6" onSubmit={handleSubmit}>
          <div className="grid gap-1">
            <label htmlFor="name">Name :</label>
            <input
              type="text"
              id="name"
              autoFocus
              className="bg-blue-50 p-2 border rounded outline-none focus:border-primary-200"
              name="name"
              value={data.name}
              onChange={handleChange}
              placeholder="Enter your name"
            />
          </div>
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
          </div>
          <div className="grid gap-1">
            <label htmlFor="confirmPassword">Confirm Password :</label>
            <div className="bg-blue-50 p-2 border rounded flex items-center focus-within:border-primary-200">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                className="w-full outline-none"
                name="confirmPassword"
                value={data.confirmPassword}
                onChange={handleChange}
                placeholder="Enter your confirm password"
              />
              <div
                onClick={() => setShowConfirmPassword((preve) => !preve)}
                className="cursor-pointer"
              >
                {showConfirmPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </div>
            </div>
          </div>

          <button
            disabled={!valideValue}
            className={` ${
              valideValue ? "bg-green-800 hover:bg-green-700" : "bg-gray-500"
            }  text-white py-2 rounded font-semibold my-3 tracking-wide`}
          >
            Register
          </button>
        </form>

        <p>
          Already have account ?{" "}
          <Link
            to={"/login"}
            className="font-semibold text-green-700 hover:text-green-800"
          >
            Login
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Register;
