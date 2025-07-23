import { emailQueue } from "../lib/Queues/EmailQueue";


export class EmailService {
    static async sendVerificationEmail(userId: string, email: string) {
        await emailQueue.add("verify-email", {
            userId, email
        }, { attempts: 3, backoff: { type: "exponential", delay: 5000 } })
    }

    static async sendPasswordResetEmail(email: string, hashedToken: string) {
        const resetUrl = `${process.env.FRONTEND_DOMAIN}/reset-password/${hashedToken}`;


        return await emailQueue.add("forgot-password", {
            email : email,
            link : resetUrl
        }, { attempts: 3, backoff: { type: "exponential", delay: 5000 } })
    }
}