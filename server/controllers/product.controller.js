import productmodel from "../models/product.model.js";

export const createProductController = async (request, response) => {
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

export const getProductController = async (request, response) => {
    try {
      let { page, limit, search } = request.body;
      if (!page) page = 1;
      if (!limit) limit = 10;
  
      const query = search ? { name: { $regex: search, $options: "i" } } : {};
      const skip = (page - 1) * limit;
  
      const [data, totalCount] = await Promise.all([
        productmodel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
        productmodel.countDocuments(query),
      ]);
  
      return response.status(200).json({
        message: "Products fetched successfully",
        data: data,
        totalCount: totalCount,
        totalPages: Math.ceil(totalCount / limit), // Key renamed to "totalPages"
      });
    } catch (error) {
      return response.status(500).json({
        message: error.message || error,
        error: true,
      });
    }
  };

  export const getProductByCategory = async(request,response)=>{
    try {
        const { id } = request.body 

        if(!id){
            return response.status(400).json({
                message : "provide category id",
                error : true,
                success : false
            })
        }

        const product = await productmodel.find({ 
            category : { $in : id }
        }).limit(15)

        return response.json({
            message : "category product list",
            data : product,
            error : false,
            success : true
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}
