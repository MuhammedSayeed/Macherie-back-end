import mongoose, { Schema, Document } from 'mongoose';

export interface IVariant extends Document {
    product: mongoose.Schema.Types.ObjectId;
    color: {
        colorHexCode: string;
        colorIdentifier: string;
    };
    images: string[];
    sizes: {
        size: string;
        stock: number;
    }[];
}

const VariantSchema: Schema = new Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    color: {
        colorHexCode: String,
        colorIdentifier: String,
    },
    images: [String],
    sizes: [{
        size: String,
        stock: {
            type: Number,
            default: 0,
        }
    }]

}, {
    timestamps: true
})

export const VariantModel = mongoose.model<IVariant>('Variant', VariantSchema)
