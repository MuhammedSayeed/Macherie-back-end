import mongoose, { Schema, Document } from 'mongoose';


interface ICategory extends Document {
    name: string;
    image: string;
    slug: string;
}

const CategorySchema: Schema = new Schema({
    name: String,
    image: String,
    slug: String,
}, {
    timestamps: true
})

export const categoryModel = mongoose.model<ICategory>('Category', CategorySchema)