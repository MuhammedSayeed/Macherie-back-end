import { catchError } from "../../middleware/catchError";
import sendError from "../../utils/SendError";
import { categoryModel } from "../../databases/models/category";


const getCategory = catchError(async (req, res, next) => {
    const { value } = req.params;

    console.log(value , "value");
    
    const results = await categoryModel.aggregate([
        {
            $lookup: {
                from: "categories",
                localField: "parent",
                foreignField: "_id",
                as: "parentData"
            }
        },
        { $unwind: "$parentData" },
        { $match: { "parentData.value": value } },
        {
            $project: {
                _id: 1,
                name: 1,
                value: 1,
                image: 1,
                parent: "$parentData._id"
            }
        }
    ])

    res.status(200).json({
        success: true,
        results
    })
})

const getCategories = catchError(async (req, res, next) => {
    const categories = await categoryModel.aggregate([
        { $match: { parent: null } },
        {
            $lookup: {
                from: "categories",
                localField: "_id",
                foreignField: "parent",
                as: "subCategories"
            }
        },
        {
            $project: {
                _id: 1,
                name: 1,
                value: 1,
                slug: 1,
                subCategories: {
                    _id: 1,
                    name: 1,
                    value: 1,
                    slug: 1,
                    image: 1
                }
            }
        }
    ])
    res.status(200).json({
        success: true,
        results: categories
    })
})
const addCategory = catchError(async (req, res, next) => {
    const { name, parent } = req.body

    const upperedCaseName = name.toUpperCase();

    const value = name.replace(/[\s&-]+/g, "").toLowerCase();

    const exists = await categoryModel.findOne({ value })

    if (exists) return sendError(next, "Category already exists", 400)

    const category = await categoryModel.create({
        name: upperedCaseName,
        value,
        parent: parent || null,
    })

    res.status(200).json({
        success: true,
        category,
    })
})
const deleteCategory = catchError(async (req, res, next) => {
    const { id } = req.params;

    const deletedDoc = await categoryModel.findByIdAndDelete(id);
    if (!deletedDoc) return sendError(next, "Category not found", 404);
    res.status(200).json({
        success: true
    })
})
const updateCategory = catchError(async (req, res, next) => {
    const { id } = req.params;
    const { name } = req.body;

    const upperedCaseName = name.toUpperCase();
    const loweredCaseName = name.toLowerCase();

    const updatedDoc = await categoryModel.findByIdAndUpdate(id, {
        name: upperedCaseName,
        value: loweredCaseName,
    })

    if (!updatedDoc) return sendError(next, "Category not found", 404);

    res.status(200).json({
        success: true
    })
})

export {
    getCategory,
    getCategories,
    addCategory,
    deleteCategory,
    updateCategory
}