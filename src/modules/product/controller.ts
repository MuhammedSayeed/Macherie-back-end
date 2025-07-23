import slugify from "slugify";
import { ProductModel } from "../../databases/models/product";
import { catchError } from "../../middleware/catchError";
import sendError from "../../utils/SendError";
import { VariantModel } from "../../databases/models/variant";
import mongoose from "mongoose";
import { extractIdFormParams } from "../../utils";
import { ProductQueryService } from "../../services/ProductServiceQueryFeatures";



const addProduct = catchError(async (req, res, next) => {
    const { title, category } = req.body;
    // create slug
    req.body.slug = slugify(title);
    // search for product with same title and category
    const product = await ProductModel.findOne({ title, category });
    if (product) return sendError(next, 'Product already exists', 400);
    // create product
    const newProduct = await ProductModel.create(req.body);
    res.status(201).json({
        success: true,
        results: newProduct
    })
})

const getProducts = catchError(async (req, res, next) => {
    const { category, style } = req.params;
    const { exclude: excludeVariantId } = req.query;
    const categoryId = extractIdFormParams(category);
    const styleId = extractIdFormParams(style);

    const matchStage: Record<string, any> = {
        'details.category': new mongoose.Types.ObjectId(categoryId)
    };

    // Only add style filter if it's not "all"
    if (style !== 'all') matchStage['details.style'] = new mongoose.Types.ObjectId(styleId);
    if (typeof excludeVariantId === 'string' && excludeVariantId) {
        matchStage['_id'] = { $ne: new mongoose.Types.ObjectId(excludeVariantId) };
    }

    const features = new ProductQueryService(VariantModel, req.query);
    features.attachProductDetails().unwindDetails()
        .filterByProductMeta(matchStage).filterByColors().filterBySizes()
        .mergeProductFields().removeProductMeta()
        .sort().paginate();

    const { results, metaData } = await features.execute();

    res.status(200).json({
        success: true,
        metaData: metaData,
        results
    })
})

const getProduct = catchError(async (req, res, next) => {
    const { id, color } = req.params;
    const pipeline = [
        {
            $match: {
                product: new mongoose.Types.ObjectId(id),
                "color.colorIdentifier": color
            }
        },
        {
            $lookup: {
                from: "products",
                localField: "product",
                foreignField: "_id",
                as: "product",
                pipeline: [
                    {
                        $project: {
                            slug: 0,
                            createdAt: 0,
                            updatedAt: 0,
                            __v: 0
                        }
                    }
                ]
            }
        },
        {
            $unwind: "$product"
        },
        {
            $addFields: {
                title: "$product.title",
                description: "$product.description",
                category: "$product.category",
                price: "$product.price",
                measurements: "$product.measurements",
                colors: "$product.colors",
                style: "$product.style",
                productId: "$product._id",
                type: "$product.type"
            }
        },
        {
            $project: {
                product: 0
            }
        }
    ];

    const results = await VariantModel.aggregate(pipeline);

    if (!results.length) return sendError(next, "Product not found", 404);



    res.status(200).json({
        success: true,
        results: results[0]
    });
});

const checkAvailability = catchError(async (req, res, next) => {
    const { id, color, size, quantity } = req.params;
    const results = await VariantModel.findOne({
        _id: id,
        "color.colorIdentifier": color
    });

    if (!results) return sendError(next, "Product not found", 404);

    const productSize = results.sizes.find((s) => s.size === size);
    console.log("productSize: ", productSize);
    
    const intQuantity = parseInt(quantity, 10);
    console.log("intQuantity: ", productSize);

    const isAvailable = !!productSize && productSize.stock >= intQuantity;
    if (!isAvailable) return sendError(next, "Insufficient stock", 400);

    res.status(200).json({
        success: true
    });
})


export {
    addProduct,
    getProducts,
    getProduct,
    checkAvailability
}