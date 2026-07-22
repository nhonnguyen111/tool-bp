import { getAllProducts,createProductService,deleteProductService ,updateProductService } from "../services/product-master.service.js";

export const getProducts = async (req, res) => {
  try {
    const data = await getAllProducts();

    return res.json({
      success: true,
      total: data.length,
      data,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

//add product
export const createProduct = async (req, res) => {

    try {

        const result = await createProductService(req.body);

        return res.json({
            success: true,
            message: "Create success",
            data: result
        });

    } catch (err) {

        console.log(err);

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }

};
//delete product
export const deleteProduct = async (req, res) => {
    try {
        const result = await deleteProductService(
            Number(req.params.id)
        );

        res.json(result);
    } catch (err) {
        res.status(400).json({
            message: err.message,
        });
    }
};

//edit product
export const updateProduct = async (req, res) => {
    try {
        const result = await updateProductService(
            Number(req.params.id),
            req.body
        );

        res.json({
            success: true,
            data: result,
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};