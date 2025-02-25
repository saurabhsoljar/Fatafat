import React, { useEffect, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import { FaArrowLeft } from "react-icons/fa";
import UseMobile from "../hooks/UseMobile";

const Search = () => {

  const navigate = useNavigate()
  const location = useLocation()
  const [isSearchPage, setIsSearchpage] = useState(false)
  const [isMobileCheck] = UseMobile()

  useEffect(()=>{
    const isSearch = location.pathname === "/search"
    setIsSearchpage(isSearch)
  },[location])
  

  const redirectToSearchPage = () => {
    navigate("/search")
  }

  console.log("search", isSearchPage);
  

  return (
    <div className="w-full  min-w-[300px] lg:min-w-[420px] h-11 lg:h-12 rounded-lg border overflow-hidden flex items-center  text-neutral-400 bg-slate-50 group focus-within:border-primary-200">
      <div>
      

      {
        (isMobileCheck && isSearchPage) ? (
          
      <Link to={"/"} className="flex justify-center items-center h-full p-2 m-1  group-focus-within:text-primary-200 bg-white rounded-full shadow-md">
      <FaArrowLeft/>
      </Link>
        ):(
          <button className="flex justify-center items-center h-full p-3  group-focus-within:text-primary-200">
        <IoSearchSharp size={22} />
      </button>
        )
      }

      </div>

    <div className="w-full h-full">
          {
            !isSearchPage ? (
              //not in search page 
              <div onClick={redirectToSearchPage} className="w-full h-full flex items-center">
        <TypeAnimation
          sequence={[
            // Same substring at the start will only be typed out once, initially
            'Search "milk"',
            1000, // wait 1s before replacing "Mice" with "Hamsters"
            'Search "bread"',
            1000,
            'Search "sugar"',
            1000,
            'Search "panner"',
            1000,
            'Search "chocolate"',
            1000,
            'Search "curd"',
            1000,
            'Search "rice"',
            1000,
            'Search "egg"',
            1000,
            'Search "chips"',
          ]}
          wrapper="span"
          speed={50}
          repeat={Infinity}
        />
      </div>
            ) : (
              // when i was search page
              <div className="w-full h-full">
                <input
                  type="text"
                  placeholder="Search for atta dal and more"
                  autoFocus={true}
                  className="bg-transparent w-full h-full outline-none"
                />
              </div>
            )
          }
    </div>

      
    </div>
  );
};

export default Search;
