import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import SummaryApi from "../common/SummaryApi";

const initialValue = {
  allCategory: [],
  allSubCategory: [],
  product: [],
};

const productSlice = createSlice({
  name: "product",
  initialState: initialValue,
  reducers: {
    setAllCategory: (state, action) => {
      if (Array.isArray(action.payload)) {
        state.allCategory = [...action.payload];
      } else {
        console.error(
          "setAllCategory received non-array payload:",
          action.payload
        );
        state.allCategory = [];
      }
    },
    setAllSubCategory: (state, action) => {
      if (Array.isArray(action.payload)) {
        state.allSubCategory = [...action.payload];
      } else {
        console.error(
          "setSubCategory received non-array payload:",
          action.payload
        );
        state.allSubCategory = [];
      }
    },
  },
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
export const { setAllCategory, setAllSubCategory } = productSlice.actions;

export default productSlice.reducer;
