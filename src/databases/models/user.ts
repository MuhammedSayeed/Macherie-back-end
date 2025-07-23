import mongoose, { Schema, type Document, Types } from "mongoose"

export interface IUser extends Document {
    name: string,
    email: string,
    password: string,
    phone: string,
    passwordChangedAt: Date,
}

const UserSchema: Schema = new Schema({
    name: String,
    email: String,
    password: String,
    phone: String,
    passwordChangedAt: Date,
},
    {
        timestamps: true,
    },
)

export const userModel = mongoose.model<IUser>("User", UserSchema)
