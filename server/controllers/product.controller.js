import productmodel from "../models/product.model.js";

export const createProductController = async(request, response) => {
    try {
        const {
        name,
        image,
        category,
        subCategory,
        unit,
        stock,
        price,
        discount,
        description,
        more_details,
        } = request.body;

        if (
        !name ||
        !image[0] ||
        !category[0] ||
        !subCategory[0] ||
        !unit ||
        !price ||
        !discount
        ) {
        return response.status(400).json({
            message: "Please fill all the fields",
            error: true,
            success: false,
        });
        }

        const product = new productmodel({
        name,
        image,
        category,
        subCategory,
        unit,
        stock,
        price,
        discount,
        description,
        more_details,
        });
        const savedProduct = await product.save();

        return response.status(201).json({
        message: "Product created successfully",
        error: false,
        success: true,
        data: savedProduct,
        });
        
    } catch (error) {
        return response.status(500).json({
        message: error.message || error,
        error: true,
        success: false,
        });
    }
};
