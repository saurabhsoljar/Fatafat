import { request, response } from "express";
import SubCategoryModel from "../models/subCategory.model.js";
import mongoose from "mongoose"; // ✅ Import this

export const AddSubCategoryController = async (request, response) => {
  try {
    const { name, image, category } = request.body;

    if (!name && !image && !category[0]) {
      return response.status(400).json({
        message: "Provide name, image,category",
        error: true,
        success: false,
      });
    }

    const payload = {
      name,
      image,
      category,
    };

    const createSubCategory = new SubCategoryModel(payload);
    const save = await createSubCategory.save();

    return response.json({
      message: "Sub Category Created",
      data: save,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const getSubCategoryController = async (request, response) => {
  try {
    const data = await SubCategoryModel.find()
      .sort({ createdAt: -1 })
      .populate("category");
    return response.json({
      message: "Sub Category data",
      data: data,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const updateSubCategoryController = async (request, response) => {
  try {
    const { _id, name, image, category } = request.body;

    // 1. Check if subcategory exists
    const existingSubCategory = await SubCategoryModel.findById(_id);

    if (!existingSubCategory) {
      return response.status(404).json({
        message: "Subcategory not found",
        error: true,
        success: false,
      });
    }

    if (!_id || !name || !category) {
      return response.status(400).json({
        message: "Missing required fields",
        error: true,
        success: false,
      });
    }

    // 2. Update the subcategory
    const updatedSubCategory = await SubCategoryModel.findByIdAndUpdate(
      _id,
      { name, image, category },
      { new: true } // Return the updated document
    );

    return response.json({
      message: "Updated successfully",
      data: updatedSubCategory,
      error: false,
      success: true,
    });
  } catch (error) {
    // 3. Proper error handling
    return response.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
};


 

export const deleteSubCategoryController = async (request, response) => { 
  try {
    const { id } = request.params; 
    console.log("Received ID:", id);

    if (!id) {
      return response.status(400).json({
        message: "Subcategory ID is required",
        error: true,
        success: false,
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {   
      console.log("Invalid ID format");
      return response.status(400).json({
        message: "Invalid subcategory ID format",
        error: true,
        success: false,
      });
    }

    const deleteSub = await SubCategoryModel.findByIdAndDelete(id);

    if (!deleteSub) {
      console.log("Subcategory not found");
      return response.status(404).json({
        message: "Subcategory not found",
        error: true,
        success: false,
      });
    }

    return response.json({
      message: "Subcategory deleted successfully",
      data: deleteSub,
      error: false,
      success: true,
    });
  } catch (error) {
    console.error("Delete Subcategory Error:", error);
    return response.status(500).json({
      message: "Something went wrong on the server.",
      error: true,
      success: false,
    });
  }
};
