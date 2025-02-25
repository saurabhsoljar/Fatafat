import React, { useState } from 'react';
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';

const Register = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [showPassword, setPassword] = useState(false);
  const [showconfirmPassword, setshowconfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData((preve) => {
      return {
        ...preve,
        [name]: value
      };
    });
  };

  const valideValue = Object.values(data).every(e1 => e1);

  const handleSubmit = async (e) => { // Mark the function as `async`
    e.preventDefault();

    if (data.password !== data.confirmPassword) {
      toast.error("Password and confirm password must be the same");
      return;
    }

    try {
      const response = await Axios({
        ...SummaryApi.register,
        data: data
      });
      console.log("response", response);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  return (
    <section className='w-full container mx-auto px-2'>
      <div className='bg-white my-4 w-full max-w-lg mx-auto rounded p-7'>
        <p>Welcome to FataFat</p>
        <form className='grid gap-4 mt-6' onSubmit={handleSubmit}> {/* Use `onSubmit` instead of `onClick` */}
          <div className='grid gap-1'>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id='name'
              autoFocus
              className='bg-blue-50 p-2 border rounded outline-none focus:border-primary-200'
              name='name'
              value={data.name}
              onChange={handleChange}
              placeholder='Enter your name'
            />
          </div>

          <div className='grid gap-1'>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id='email'
              className='bg-blue-50 p-2 border rounded outline-none focus:border-primary-200'
              name='email'
              value={data.email}
              onChange={handleChange}
              placeholder='Enter your Email'
            />
          </div>

          <div className='grid gap-1'>
            <label htmlFor="password">Password</label>
            <div className='bg-blue-50 p-2 border rounded flex items-center focus-within:border-primary-200'>
              <input
                type={showPassword ? "text" : "password"}
                id='password'
                className='w-full outline-none'
                name='password'
                value={data.password}
                onChange={handleChange}
                placeholder='Enter your Password'
              />
              <div onClick={() => setPassword(preve => !preve)} className='cursor-pointer'>
                {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </div>
            </div>
          </div>

          <div className='grid gap-1'>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className='bg-blue-50 p-2 border rounded flex items-center focus-within:border-primary-200'>
              <input
                type={showconfirmPassword ? "text" : "password"}
                id='confirmPassword'
                className='w-full outline-none'
                name='confirmPassword'
                value={data.confirmPassword}
                onChange={handleChange}
                placeholder='Enter your Confirm Password'
              />
              <div onClick={() => setshowconfirmPassword(preve => !preve)} className='cursor-pointer'>
                {showconfirmPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </div>
            </div>
          </div>

          <button
            disabled={!valideValue}
            className={`${valideValue ? "bg-green-800 hover:bg-green-700" : "bg-gray-500"} text-white py-2 rounded font-semibold my-3 tracking-wide`}
          >
            Register
          </button>
        </form>
      </div>
    </section>
  );
};

export default Register;