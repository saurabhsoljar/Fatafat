import React from "react";
import { IoClose } from "react-icons/io5";

const ConfirmBox = ({ cancel, confirm, close }) => { // Fixed prop name from 'cancle' to 'cancel'
  return (
    <div className="fixed top-0 bottom-0 right-0 left-0 z-50 bg-neutral-800 bg-opacity-70 p-4 flex justify-center items-center">
      <div className="bg-white w-full max-w-md p-4 rounded">
        <div className="flex justify-between items-center gap-3">
          <h1 className="font-semibold">Permanent Delete</h1> {/* Fixed spelling */}
          <button 
            onClick={close}
            aria-label="Close confirmation dialog" // Added accessibility
            className="hover:text-red-600 transition-colors"
          >
            <IoClose size={25} />
          </button>
        </div>
        <p className="my-4">Are you sure permanent delete?</p> {/* Fixed spelling */}
        <div className="w-fit ml-auto flex items-center gap-4 mt-4"> {/* Added flex and adjusted spacing */}
          <button 
            onClick={cancel} // Fixed prop name
            className="px-4 py-1 border rounded border-red-500 text-red-600 hover:bg-red-700 hover:text-white transition-colors"
            type="button" // Added type attribute
          >
            Cancel {/* Fixed spelling */}
          </button>
          <button
            onClick={confirm}
            className="px-4 py-1 border rounded border-green-500 text-green-600 hover:bg-green-700 hover:text-white transition-colors"
            type="button" // Added type attribute
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmBox;