import mongoose, { Schema, type Document } from "mongoose"
import type { Types } from "mongoose"

export interface IBanner extends Document {
    image: string,
    category: Types.ObjectId,
}

const BannerSchema: Schema = new Schema({
    image: {
        type: String,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    }

},
    {
        timestamps: true,
    },
)

export const bannerModel = mongoose.model<IBanner>("Banner", BannerSchema)
