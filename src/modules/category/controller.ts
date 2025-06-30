import slugify from "slugify";
import { categoryModel } from "../../databases/models/categories";
import { catchError } from "../../middleware/catchError";
import sendError from "../../utils/SendError";



const getCategories = catchError(async (req, res, next) => {
    const categories = await categoryModel.find({})
    res.status(200).json({
        success: true,
        categories
    })
})
const addCategory = catchError(async (req, res, next) => {
    const { name, image } = req.body;

    const loweredCaseName = name.toLowerCase();
    const slug = slugify(loweredCaseName);

    // check if category already exists
    const existingCategory = await categoryModel.findOne({ name: loweredCaseName }).select('_id');
    if (existingCategory) return sendError(next, "Category already exists", 400);

    // create category
    await categoryModel.create({
        name: loweredCaseName,
        slug,
        image
    });

    res.status(200).json({
        success: true
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
    const { name, image } = req.body;

    const loweredCaseName = name.toLowerCase();
    const slug = slugify(loweredCaseName);

    const updatedDoc = await categoryModel.findByIdAndUpdate(id, {
        name: loweredCaseName,
        slug,
        image
    })

    if (!updatedDoc) return sendError(next, "Category not found", 404);

    res.status(200).json({
        success: true
    })
})

export {
    getCategories,
    addCategory,
    deleteCategory,
    updateCategory
}