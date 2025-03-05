import React from "react";
import UserMenu from "../components/UserMenu";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const user = useSelector(state => state.user)
  
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Navigation - Glass Morphism Design */}
        <nav className="lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:border-r lg:border-white/10 lg:bg-gray-900/80 lg:backdrop-blur-lg max-[calc(100vh-96px)]:">
          <div className="p-6 lg:p-8 hidden lg:block">
            <h2 className="text-2xl font-bold text-white mb-8">Dashboard</h2>
            <UserMenu />
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 bg-gray-50 lg:rounded-tl-[40px] overflow-hidden">
          <div className="h-full p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto space-y-8">
            {/* Content Header */}
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Account Overview
              </h1>
              <div className="flex items-center space-x-4">
                {/* Notification Bell */}
                <button className="p-2 hover:bg-gray-200 rounded-full transition-all">
                  <svg
                    className="w-6 h-6 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="grid gap-8">
              <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 transition-all hover:shadow-2xl">
                <Outlet />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Menu Toggle (Add functionality as needed) */}
      <button className="fixed bottom-6 right-6 lg:hidden p-4 bg-gray-900 text-white rounded-full shadow-xl">
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
    </div>
  );
};

export default Dashboard;
