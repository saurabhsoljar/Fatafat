import React, { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import Search from "./Search";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaRegUserCircle } from "react-icons/fa";
import UseMobile from "../hooks/UseMobile";
import { BsCart4 } from "react-icons/bs";
import { useSelector } from "react-redux";
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import UserMenu from "./UserMenu";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import DisplayCartItem from "./DisplayCartItem";

const Header = () => {
  const [isMobileCheck] = UseMobile();
  const location = useLocation();
  const isSearchPage = location.pathname === "/search";
  const navigate = useNavigate();
  const user = useSelector((state) => state?.user);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const cartItem = useSelector(state => state.cartItem.cart);
  // const [totalPrice, setTotalPrice] = useState(0);
  // const [totalQty, setTotalQty] = useState(0);
  const {totalPrice,totalQty} = useGlobalContext()
  const [openCartSection, setOpenCartSection] = useState(false);
  

  const redirectToLoginPage = () => {
    navigate("/login");
  };

  const handleCloseUserMenu = () => {
    setOpenUserMenu(false);
  };

  const handleMobileUser = () => {
    if (!user._id) {
      navigate("/login");
      return;
    }
    navigate("/user");
  };

  //total item and price
  useEffect(()=>{
    const qty = cartItem.reduce((preve,curr) =>{
      return preve + curr.quantity
    },0)
    setTotalQty(qty)

    const tPrice = cartItem.reduce((preve,curr)=>{
      return preve + (curr?.productId?.price * curr.quantity)
    },0)
    setTotalPrice(tPrice)
  },[cartItem])

  return (
    <header className="fixed w-full top-0 left-0 right-0 h-24 lg:h-20 bg-white shadow-md z-50">
      <div className="container mx-auto h-full px-4">
        <div className="h-full flex items-center justify-between">
          {/* Logo Section */}
          <Link
            to="/"
            className="flex items-center transition-transform hover:scale-105"
          >
            <img
              src={logo}
              alt="Logo"
              className="hidden lg:block w-40 object-contain"
            />
            <img
              src={logo}
              alt="Logo"
              className="lg:hidden w-32 object-contain"
            />
          </Link>

          {/* Search Section */}
          {!isMobileCheck && (
            <div className="flex-1 max-w-2xl mx-8 hidden lg:block">
              <Search />
            </div>
          )}

          {/* Right Section */}
          <div className="flex items-center gap-4 lg:gap-6">
            {/* User Section */}
            <div 
              className="relative group"
              onMouseEnter={() => !isMobileCheck && setOpenUserMenu(true)}
              onMouseLeave={() => !isMobileCheck && setOpenUserMenu(false)}
            >
              {user?._id ? (
                <>
                  <button
                    onClick={() => isMobileCheck && setOpenUserMenu(!openUserMenu)}
                    className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <FaRegUserCircle className="w-6 h-6" />
                    <span className="hidden lg:block font-medium">
                      {user.name || "Account"}
                    </span>
                    <span className="hidden lg:block">
                      {openUserMenu ? (
                        <GoTriangleUp className="w-4 h-4" />
                      ) : (
                        <GoTriangleDown className="w-4 h-4" />
                      )}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  <div
                    className={`absolute right-0 top-12 bg-white rounded-xl shadow-2xl border border-gray-100 min-w-48 transition-all duration-300 transform ${
                      openUserMenu
                        ? "opacity-100 visible translate-y-0"
                        : "opacity-0 invisible -translate-y-2"
                    }`}
                  >
                    <div className="p-2">
                      <UserMenu close={handleCloseUserMenu} />
                    </div>
                  </div>
                </>
              ) : (
                <button
                  onClick={redirectToLoginPage}
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <FaRegUserCircle className="w-6 h-6" />
                  <span className="hidden lg:block font-medium">Login</span>
                </button>
              )}
            </div>

            {/* Cart Button */}
            <button onClick={()=>setOpenCartSection(true)} className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 px-4 py-2 rounded-full text-white shadow-md hover:shadow-xl transition-all relative">
              <BsCart4 className="w-6 h-6 text-semibold" />
              {
                cartItem[0] ? (
                  <div>
                    <p>{totalQty}  Items</p>
                    <p>{DisplayPriceInRupees(totalPrice)}</p>
                  </div>
                ):(
                  <span className="font-semibold hidden lg:block">My Cart</span>
                )
              }
              
              <span className="absolute -top-2 -right-1 bg-white text-blue-600 rounded-full px-2 py-1 text-xs font-bold shadow-sm">
                0
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {isMobileCheck && !isSearchPage && (
          <div className="absolute bottom-0 left-0 right-0 px-4 pb-2 bg-white border-t border-gray-100">
            <Search />
          </div>
        )}
      </div>
      {
        openCartSection && (
          <DisplayCartItem close={()=>setOpenCartSection(false)}/>
        )
      }
    </header>
  );
};

export default Header;