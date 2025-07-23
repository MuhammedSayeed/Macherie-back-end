import mongoose, { Schema, type Document } from "mongoose"
import type { Types } from "mongoose"

export interface ICategory extends Document {
  name: string
  value: string
  parent: Types.ObjectId[],
  image?: string
}

const CategorySchema: Schema = new Schema({
  name: String,
  value: {
    type: String,
    index: true
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    default: null
  },
  image: {
    type: String,
    default: null
  }
},
  {
    timestamps: true,
  },
)

export const categoryModel = mongoose.model<ICategory>("Category", CategorySchema)
