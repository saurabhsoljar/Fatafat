import { Router } from "express";
import  auth  from "../middleware/auth.js";
import { createProductController, getProductByCategory, getProductByCategoryAndSubCategory, getProductController, getProductDetails, updateProductDetails } from "../controllers/product.controller.js";
import { admin } from "../middleware/Admin.js";

const productRouter = Router();

productRouter.post("/create",auth,admin, createProductController);
productRouter.post("/get", getProductController);
productRouter.post("/get-by-category", getProductByCategory);
productRouter.post("/get-product-by-category-and-subcategory", getProductByCategoryAndSubCategory);
productRouter.post("/get-product-details", getProductDetails);

//update product
productRouter.put("/update-product-details", auth,admin,updateProductDetails);

export default productRouter;