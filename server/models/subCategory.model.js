import mongoose, { Types } from "mongoose";

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      Types: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    category: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "category",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const subCategoryModel = mongoose.model("subCategory", subCategorySchema);

export default subCategoryModel;
