import bcrypt from "bcryptjs"

export class PasswordService {
    static async hashPassword(password: string): Promise<string> {
        const saltRounds = 12
        return await bcrypt.hash(password, saltRounds)
    }

    static async comparePassword(password: string, hashedPassword: string) {
        return await bcrypt.compare(password, hashedPassword);
    }
}