import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import SummaryApi from "../common/SummaryApi";

const initialValue = {
  allCategory: [],
  loadingCategory : false,
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
    setLoadingCategory : (state,action)=>{
      state.loadingCategory = action.payload
    },
    setAllSubCategory: (state, action) => {
      if (Array.isArray(action.payload)) {
        state.allSubCategory = [...action.payload];
      } else {
        console.error(
          "setSubCategory received non-array payload:",
          action.payload
        );
        state.allSubCategory = [...action.payload];
      }
    },
  },
});

export const fetchCategories = () => async (dispatch) => {
  try {
    const response = await axios(SummaryApi.getCategory);
    dispatch(setAllCategory(response.data?.data || []));  
  } catch (error) {
    console.error("Category fetch error:", error);
  }
};

export const { setAllCategory, setAllSubCategory,setLoadingCategory } = productSlice.actions;

export default productSlice.reducer;
