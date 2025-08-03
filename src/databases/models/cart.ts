import mongoose, { Schema, type Document, Types } from "mongoose"

export interface ICartItem {
    productId: Types.ObjectId,
    variantId: Types.ObjectId,
    title: string
    price: number
    image: string
    quantity: number
    color?: {
        colorHexCode: String,
        colorIdentifier: String,
    }
    size?: string
}

export interface ICart extends Document {
    user: Types.ObjectId
    cartItems: ICartItem[]
    totalPrice: number
    createdAt: Date
    updatedAt: Date
}

const CartItemSchema = new Schema({
    productId: {
        type: Types.ObjectId,
        ref: "Product"
    },
    variantId: {
        type: Types.ObjectId,
        ref: "Variant"
    },
    title: String,
    price: Number,
    image: String,
    quantity: Number,
    color: {
        colorHexCode: String,
        colorIdentifier: String,
    },
    size: String
}, { _id: false })

const CartSchema = new Schema({
    user: {
        type: Types.ObjectId,
        ref: "User"
    },
    cartItems: [CartItemSchema],
    totalPrice: Number
}, {
    timestamps: true
})

export const CartModel = mongoose.model<ICart>("Cart", CartSchema)