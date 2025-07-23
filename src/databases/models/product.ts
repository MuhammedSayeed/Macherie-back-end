import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
    category: mongoose.Schema.Types.ObjectId;
    title: string;
    slug: string;
    description: string;
    style: mongoose.Schema.Types.ObjectId;
    price: number;
    measurement: {
        size: String,
        charts: {
            neck?: Number, // For tops
            chest?: Number, // For tops 
            waist?: Number, // For bottoms
            lowRise?: Number, // For bottoms
        }
    }[]
    colors: [
        {
            colorHexCode: String,
            colorIdentifier: String
        }
    ];
    type: "tops" | "bottoms"
}

const ProductSchema: Schema = new Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    title: String,
    slug: String,
    description: String,
    style: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Style'
    },
    price: Number,
    measurements: [{
        size: String,
        charts: {
            neck: Number,
            chest: Number,
            waist: Number,
            lowRise: Number
        }
    }],
    colors: [
        {
            colorHexCode: String,
            colorIdentifier: String
        }
    ],
    type: {
        type: String,
        enum: ["tops", "bottoms"]
    }

}, {
    timestamps: true
})

export const ProductModel = mongoose.model<IProduct>('Product', ProductSchema)
