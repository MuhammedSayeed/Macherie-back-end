import mongoose, { Schema, type Document } from "mongoose"
import { Types } from "mongoose"



interface IAddress {
    country: string,
    address: string,
    city: string,
    governorate: string
}

export interface IShippingAddress extends Document {
    user: Types.ObjectId,
    addresses: IAddress[]
}

const ShippingAddressSchema: Schema = new Schema({
    user: {
        type: Types.ObjectId,
        ref: "User",
    },
    addresses: [
        {
            country: String,
            address: String,
            city: String,
            governorate: String,
            isDefault : {
                type : Boolean,
                default : false
            }
        }
    ]
},
    {
        timestamps: true,
    },
)

export const ShippingAddressModel = mongoose.model<IShippingAddress>("ShippingAddress", ShippingAddressSchema)
