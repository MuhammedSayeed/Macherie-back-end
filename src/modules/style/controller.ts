import { styleModel } from "../../databases/models/style";
import { catchError } from "../../middleware/catchError";
import { extractIdFormParams } from "../../utils";
import sendError from "../../utils/SendError";


const getStyles = catchError(
    async (req, res, next) => {
        const { category } = req.params;

        const categoryId = extractIdFormParams(category);

        const styles = await styleModel.find({ category: categoryId }).select('-createdAt -updatedAt -__v').lean();

        if (styles.length === 0) return res.status(200).json({
            success: true,
            results: []
        })

        // add all option to styles data
        const allOption = {
            value: "all",
            name: "See all",
            _id: "all",
            category: categoryId
        }

        res.status(200).json({
            success: true,
            results: [allOption, ...styles]
        })
    }
)
const addStyle = catchError(
    async (req, res, next) => {
        const { category, name } = req.body;

        const upperedCaseName = name.toUpperCase();

        const value = name.replace(/[\s&-]+/g, "").toLowerCase();

        const exists = await styleModel.findOne({ name: upperedCaseName, value , category });

        if (exists) return sendError(next, "Style exists before", 400)

        const newStyle = await styleModel.create({ name: upperedCaseName, value, category });

        res.status(201).json({
            success: true,
            results: newStyle
        })

    }
)


export {
    getStyles,
    addStyle
}