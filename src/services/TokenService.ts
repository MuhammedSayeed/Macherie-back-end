import jwt, { SignOptions } from "jsonwebtoken"
import { StringValue } from "ms";
import { IPasswordResetToken, PasswordResetTokenModel } from "../databases/models/passwordResetToken";
import mongoose from "mongoose";
import { AppError } from "../utils/AppError";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET as string;

type ExpirationTime = number | StringValue | undefined;

export class TokenService {

    static generateAccessToken(payload: Record<string, any>, time: ExpirationTime = "7d") {
        const options: SignOptions = {
            expiresIn: time
        };
        return jwt.sign(payload, JWT_SECRET, options);
    }

    static async getPasswordResetTokenByUserId(_id: string) {
        const userObjectId = new mongoose.Types.ObjectId(_id);
        return await PasswordResetTokenModel.findOne({
            user: userObjectId,
            expiresAt: { $gt: Date.now() }
        }).select('_id').lean();
    }

    static async getPasswordResetTokenByHashedToken(token: string) {
        const doc = await PasswordResetTokenModel.findOne({
            token
        });
        if (!doc) throw new AppError("Invalid token", 400);
        if (new Date(doc.expiresAt).getTime() < Date.now()) throw new AppError("Token expired", 400);
        return doc as IPasswordResetToken;
    }

    static async savePasswordResetToken(userId: string, hashedToken: string) {
        const userObjectId = new mongoose.Types.ObjectId(userId);
        return await PasswordResetTokenModel.create({
            user: userObjectId,
            token: hashedToken,
        })
    }

    static hashByCrypto(value: string) {
        return crypto.createHash("sha256").update(value).digest("hex");
    }

    static async deletePasswordResetToken(userId: string) {
        const userObjectId = new mongoose.Types.ObjectId(userId);
        return await PasswordResetTokenModel.findByIdAndDelete(userObjectId);
    }

    static verifyToken(token: string) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
            _id: string;
            name: string;
            email: string;
        }
        if (!decoded._id) throw new AppError("Invalid token", 400);
        return decoded;
    }
}