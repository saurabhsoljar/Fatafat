import React from "react";
import No_Data from "../assets/No_Data.png";

const NoData = ({
  message = "No data found",
  description = "Sorry, we couldn't find any results",
  showRefresh = false,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] gap-4 p-8 text-center">
      {/* Animated Image */}
      <div className="animate-bounce-slow">
        <img
          src={No_Data}
          alt="No data illustration"
          className="w-48 md:w-56 opacity-90 hover:opacity-100 transition-opacity"
        />
      </div>

      {/* Text Content */}
      <div className="space-y-2">
        <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
          {message}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md">
          {description}
        </p>
      </div>

      {/* Optional Refresh Button */}
      {showRefresh && (
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg
                   hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Refresh Page
        </button>
      )}
    </div>
  );
};

export default NoData;
