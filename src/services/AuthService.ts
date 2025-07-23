import { IUser, userModel } from "../databases/models/user"
import { emailQueue } from "../lib/Queues/EmailQueue"
import { AppError } from "../utils/AppError"
import { hashPassword } from "../utils/auth"
import { Types } from "mongoose";
import { PasswordService } from "./PasswordService";

interface IRegiserData {
    name: string,
    email: string,
    phone: string,
    password: string,
}



export class AuthService {

    static async registerUser(userData: IRegiserData) {
        const { name, email, phone, password } = userData

        const existingUser = await userModel.findOne({ email })
        if (existingUser) throw new AppError("User already exists", 400);

        // hash password
        const hashedPassword: string = await hashPassword(password)

        // create user
        const user = new userModel({
            name,
            email,
            phone,
            password: hashedPassword,
        });

        await user.save();

        return user;
    }

    static async authenticateUser(email: string, password: string) {
        const user = await userModel.findOne({ email })
        if (!user) throw new AppError("Invalid credentials", 400);

        const isPasswordCorrect = await PasswordService.comparePassword(password, user.password);
        if (!isPasswordCorrect) throw new AppError("Invalid credentials", 400);

        return user;
    }



    static createUserResponse(user: IUser) {
        return {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
        }
    }
}