import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import { Link, useLocation, useNavigate } from "react-router-dom";

const OtpVerification = () => {
  // useState Hooks
  const [data, setData] = useState(["", "", "", "", "", ""]);
  const navigate = useNavigate();
  const inputRef = useRef([]);
  const location = useLocation();

  console.log("location", location);

  useEffect(() => {
    if (!location?.state?.email) {
      navigate("/forgot-password");
    }
  }, []);

  // valideValue Variable
  // This variable checks if all the fields in the 'data' state are filled.
  const valideValue = data.every((el) => el);

  // handleSubmit Function
  // This function handles the form submission.
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make an API call to register the user
      const response = await Axios({
        ...SummaryApi.forgot_password_otp_verification,
        data: {
          otp: data.join(""),
          email: location?.state?.email,
        },
      });

      // Handle API response
      if (response.data.error) {
        toast.error(response.data.message);
      }

      if (response.data.success) {
        toast.success(response.data.message);
        setData(["", "", "", "", "", ""]);
        navigate("/reset-password", {
          state: {
            data: response.data,
            email: location?.state?.email,
          },
        });
      }
    } catch (error) {
      // Handle API errors using AxiosToastError utility
      console.log("error", error);
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
          <p className="text-green-600 font-bold py-3   transition-colors duration-300 ">
            Enter Your OTP
          </p>
        </div>

        <form className="grid gap-4  py-2" onSubmit={handleSubmit}>
          <div className="grid gap-1">
            <label htmlFor="otp">Enter OTP :</label>
            <div className="flex items-center gap-2 justify-between">
              {data.map((element, index) => {
                return (
                  <input
                    key={"otp" + index}
                    type="text"
                    id="otp"
                    ref={(ref) => {
                      inputRef.current[index] = ref;
                      return ref;
                    }}
                    value={data[index]}
                    onChange={(e) => {
                      const value = e.target.value;
                      console.log("value", value);

                      const newData = [...data];
                      newData[index] = value;
                      setData(newData);

                      if (value && index < 5) {
                        inputRef.current[index + 1].focus();
                      }
                    }}
                    maxLength={1}
                    className="bg-blue-50 w-full max-w-16 p-2 border rounded outline-none focus:border-primary-200
                    text-center font-semibold
                    "
                  />
                );
              })}
            </div>
          </div>

          <button
            disabled={!valideValue}
            className={` ${
              valideValue ? "bg-green-800 hover:bg-green-700" : "bg-gray-500"
            }  text-white py-2 rounded font-semibold my-3 tracking-wide`}
          >
            Verify OTP
          </button>
        </form>

        <p>
          Already have account ?
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

export default OtpVerification;
