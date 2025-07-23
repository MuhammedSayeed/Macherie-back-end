import mongoose, { Schema, type Document } from "mongoose"
import type { Types } from "mongoose"

export interface IPasswordResetToken extends Document {
    user: Types.ObjectId,
    token: string,
    expiresAt: Date
}

const PasswordResetTokenSchema: Schema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    token: {
        type: String,
    },
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 15 * 60 * 1000),
    }

},
    {
        timestamps: true,
    },
)

export const PasswordResetTokenModel = mongoose.model<IPasswordResetToken>("PasswordResetToken", PasswordResetTokenSchema)
