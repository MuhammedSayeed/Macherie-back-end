import bcrypt from "bcryptjs"
import jwt, { SignOptions } from "jsonwebtoken"
import { StringValue } from "ms";

const JWT_SECRET = process.env.JWT_SECRET as string;

type ExpirationTime = number | StringValue | undefined;

export const generateToken = (payload: Record<string, any>, time: ExpirationTime = "7d"): string => {
    const options: SignOptions = {
        expiresIn: time
    };

    return jwt.sign(payload, JWT_SECRET, options);
}

export const hashPassword = async (password: string): Promise<string> => {
    const saltRounds = 12
    return await bcrypt.hash(password, saltRounds)
}

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(password, hashedPassword)
}



export const verifyToken = (token: string): any => {
    try {
        return jwt.verify(token, JWT_SECRET)
    } catch (error) {
        return null
    }
}
