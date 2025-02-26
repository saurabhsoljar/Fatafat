import React, { useState } from "react";
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import { Link, useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  // useState Hooks
  const [data, setData] = useState({
    email: "",
  });

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

    try {
      // Make an API call to register the user
      const response = await Axios({
        ...SummaryApi.forgot_password,
        data: data,
      });

      // Handle API response
      if (response.data.error) {
        toast.error(response.data.message);
      }

      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/varification-otp", {
          state: data,
        });
        setData({
          email: "",
        });
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
          <p className="text-green-600 font-bold py-3   transition-colors duration-300 ">
            Forgot Password
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

          <button
            disabled={!valideValue}
            className={` ${
              valideValue ? "bg-green-800 hover:bg-green-700" : "bg-gray-500"
            }  text-white py-2 rounded font-semibold my-3 tracking-wide`}
          >
            Send OTP
          </button>
        </form>

        <p>
          Alreadt have account ?
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

export default ForgotPassword;
