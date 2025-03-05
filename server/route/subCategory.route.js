import { Router } from "express"
import auth from "../middleware/auth.js"
import { AddSubCategoryController,getSubCategoryController } from "../controllers/subCategory.controller.js"

const subCategoryRouter = Router()

subCategoryRouter.post('/create',auth,AddSubCategoryController)
subCategoryRouter.get('/get',getSubCategoryController)

export default subCategoryRouter