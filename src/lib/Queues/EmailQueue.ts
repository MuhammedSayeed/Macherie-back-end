import { Queue, Worker } from "bullmq"
import { sendResetPasswordEmail, sendVerifyEmail } from "../../config/email";
import { generateVerificationCode } from "../../utils/code";
import verificationCode from "../../databases/models/verificationCode";
import mongoose from "mongoose";

// Redis connection options
const redisConnection = {
    host: process.env.REDIS_HOST || "localhost",
    port: Number.parseInt(process.env.REDIS_PORT || "6379"),
    password: process.env.REDIS_PASSWORD,
}

// email queue
export const emailQueue = new Queue("email-queue", {
    connection: redisConnection,
    defaultJobOptions: {
        removeOnComplete: 100, // Keep last 100 completed jobs
        removeOnFail: 50, // Keep last 50 failed jobs
    }
})

// Email worker
const emailWorker = new Worker("email-queue", async (job) => {
    try {
        switch (job.name) {
            case "verify-email": {
                const { userId, email } = job.data;
                // 1. Generate code
                const code = generateVerificationCode();
                const userObjectId = new mongoose.Types.ObjectId(userId);
                // 2. Store in DB
                await verificationCode.create({
                    user: userObjectId,
                    code
                });
                // 3. Send email
                await sendVerifyEmail(email, code)
                console.log(`✅ Verification email sent successfully to ${email}`)
                break;
            }
            case "forgot-password": {
                const { email, link } = job.data;
                
                await sendResetPasswordEmail(email, link)
                console.log(`✅ Forgot password email sent successfully to ${email}`)
                break;
            }
            default:
                throw new Error(`Unknown job type: ${job.name}`)
        }
    } catch (error) {
        console.error(`❌ Error in job '${job.name}':`, error);
        throw error;
    }

}, {
    connection: redisConnection,
    concurrency: 5,
})

// monitoring
emailWorker.on("completed", (job) => {
    console.log(`✅ Job ${job.id} completed successfully`)
})

emailWorker.on("failed", (job, err) => {
    console.log(`❌ Job ${job?.id} failed:`, err.message)
})

emailWorker.on("error", (err) => {
    console.error("❌ Worker error:", err)
})

// shutdown
process.on("SIGINT", async () => {
    console.log("🛑 Shutting down email worker...")
    await emailWorker.close()
    await emailQueue.close()
    process.exit(0)
})
export { emailWorker }