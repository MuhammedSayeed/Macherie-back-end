import mongoose, { Schema, Document } from 'mongoose';

interface IStyle extends Document {
    name: string;
    value: string;
    category: string;
}

const StyleSchema: Schema = new Schema({
    name: String,
    category : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    value: String
}, {
    timestamps: true
})

export const styleModel = mongoose.model<IStyle>('Style', StyleSchema)