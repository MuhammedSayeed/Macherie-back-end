import { bannerModel } from "../../databases/models/banner";
import { catchError } from "../../middleware/catchError";
import sendError from "../../utils/SendError";
import NodeCache from 'node-cache';
const cache = new NodeCache({ stdTTL: 60 * 5 });


const getBanner = catchError(async (req, res, next) => {
    const { value } = req.params;

    const cacheKey = `banner:${value}`;
    const cached = cache.get(cacheKey);
    if (cached)  return res.status(200).json({success: true, results: cached});

    const bannerData = await bannerModel.aggregate([
        {
            $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "categoryData"
            }
        },
        { $unwind: "$categoryData" },
        { $match: { "categoryData.value": value } },
        {
            $project: {
                _id: 1,
                image: 1,
                category: "$categoryData"
            }
        }
    ]);

    const banner = bannerData[0]; 
    if (!banner) return sendError(next, "Banner not found", 404);

    cache.set(cacheKey, banner);

    res.status(200).json({
        success: true,
        results: banner
    });
})

const addBanner = catchError(async (req, res, next) => {
    const { category, image } = req.body;

    const banner = await bannerModel.create({
        category,
        image
    })
    res.status(200).json({
        success: true,
        results: banner
    })
})

export {
    getBanner,
    addBanner
}