import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import SummaryApi from "../common/SummaryApi";


const initialValue = { 
  allCategory: [],
  subCategory: [],
  product: []
};

const productSlice = createSlice({
  name: "product",
  initialState: initialValue,
  reducers: {
    setAllCategory: (state, action) => {
      if (Array.isArray(action.payload)) {
        state.allCategory = [...action.payload];
      } else {
        console.error("setAllCategory received non-array payload:", action.payload);
        state.allCategory = [];
      }
    },
    setSubCategory: (state, action) => {
      if (Array.isArray(action.payload)) {
        state.subCategory = [...action.payload];
      } else {
        console.error("setSubCategory received non-array payload:", action.payload);
        state.subCategory = [];
      }
    }
  }
});

export const fetchCategories = () => async (dispatch) => {
  try {
    const response = await axios(SummaryApi.getCategory);
    //console.log("API Response:", response.data); // Debugging line
    dispatch(setAllCategory(response.data?.data || [])); // Ensure it's an array
  } catch (error) {
    console.error("Category fetch error:", error);
  }
};

// Export actions
export const { setAllCategory, setSubCategory } = productSlice.actions;

export default productSlice.reducer;
