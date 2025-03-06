import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { IoClose } from "react-icons/io5";

const ViewImage = ({ url, close }) => {
  // Add keyboard escape support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [close]);

  return (
    <div className="fixed inset-0 bg-neutral-900/90 backdrop-blur-sm flex justify-center items-center z-[9999] p-4 animate-fade-in">
      <div className="relative group w-full max-w-6xl rounded-xl bg-white/5 backdrop-blur-2xl shadow-2xl overflow-hidden border border-white/10">
        {/* Close Button */}
        <button 
          onClick={close}
          className="absolute right-4 top-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 shadow-lg"
          aria-label="Close image viewer"
        >
          <IoClose 
            size={28} 
            className="text-white/90 hover:text-white transition-colors"
          />
        </button>

        {/* Image Container */}
        <div className="relative h-[80vh] w-full flex items-center justify-center p-4">
          <img
            src={url}
            alt="Full screen preview"
            className="w-auto h-full object-contain rounded-lg shadow-xl transform transition-transform duration-500 group-hover:scale-95 cursor-zoom-out"
            onClick={close}
            onLoad={(e) => e.currentTarget.classList.add('animate-scale-up')}
          />
        </div>

        {/* Background Click Layer */}
        <div 
          className="absolute inset-0 -z-10 cursor-zoom-out" 
          onClick={close}
        />
      </div>
    </div>
  );
};

ViewImage.propTypes = {
  url: PropTypes.string.isRequired,
  close: PropTypes.func.isRequired,
};

export default ViewImage;