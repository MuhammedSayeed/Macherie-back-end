import mongoose from "mongoose";
import { ProductModel } from "../../databases/models/product";
import { VariantModel } from "../../databases/models/variant";
import { catchError } from "../../middleware/catchError";
import sendError from "../../utils/SendError";


const addVariant = catchError(async (req, res, next) => {
    const { product, color, images, sizes } = req.body;

    // check if product exists
    const existingProduct = await ProductModel.findById({ _id: product });
    if (!existingProduct) return sendError(next, `Can't add variant: product does not exist`, 400);
    
    // create variant
    const newVariant = await VariantModel.create({
        product,
        color,
        images,
        sizes
    })

    existingProduct.colors.push(color);
    await existingProduct.save();

    res.status(201).json({
        success: true,
        results: newVariant
    })

})

export { addVariant }