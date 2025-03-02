import React from "react";

const Loading = ({ fullScreen = false, label = "Loading...", size = "medium" }) => {
  const sizes = {
    small: "w-8 h-8",
    medium: "w-12 h-12",
    large: "w-16 h-16"
  };

  return (
    <div className={`${fullScreen ? "fixed inset-0 bg-black/10 backdrop-blur-sm" : ""} flex items-center justify-center mt-8`}>
      <div className="flex flex-col items-center gap-3">
        {/* Animated Spinner */}
        <div 
          className={`${sizes[size]} relative animate-spin [animation-timing-function:cubic-bezier(0.65,0.05,0.36,1)]`}
          role="status"
        >
          {/* Outer Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-slate-200/30"></div>
          
          {/* Animated Arc */}
          <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-r-transparent border-b-transparent border-blue-500"></div>
          
          {/* Inner Dot */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        </div>

        {/* Loading Text */}
        {label && (
          <span className="text-sm font-medium text-slate-600 animate-pulse">
            {label}
          </span>
        )}
      </div>
    </div>
  );
};

export default Loading;