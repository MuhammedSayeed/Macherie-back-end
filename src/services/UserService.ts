import { Types } from "mongoose";
import { userModel } from "../databases/models/user";
import { AppError } from "../utils/AppError";


export class UserService {


    static async findUserByEmail(email: string) {
        const user = await userModel.findOne({ email }).select('_id').lean();
        if (!user) throw new AppError('User not found', 404);
        return user;
    }

    static async updateUserPassword(userId: Types.ObjectId, hashedPassword: string) {
        const user = await userModel.findByIdAndUpdate(userId, {
            password: hashedPassword,
        });
        if (!user) throw new AppError('User not found', 404);
        return user;
    }

    static async updateLastTimePasswordChanged(userId: Types.ObjectId) {
        const user = await userModel.findByIdAndUpdate(userId, {
            passwordChangedAt: Date.now()
        });
        if (!user) throw new AppError('User not found', 404);
        return user;
    }

    static async getUserById(userId: string) {
        const userObjectId = new Types.ObjectId(userId);
        const user = await userModel.findById(userObjectId).select('_id email name phone').lean();
        if (!user) throw new AppError('User not found', 404);
        return user;
    }
}