import nodemailer from 'nodemailer'
import { VerifyEmailHtml } from '../html/verify-email-html';
import { ResetPasswordHtml } from '../html/reset-password-html';


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

const sendVerifyEmail = async (email: string, code: string) => {
    await transporter.sendMail({
        from: '"Machérie"',
        to: email,
        subject: "Verify your email",
        html: VerifyEmailHtml(code)
    })
}

const sendResetPasswordEmail = async (email: string, link: string) => {
    await transporter.sendMail({
        from: '"Machérie"',
        to: email,
        subject: "Reset your password",
        html: ResetPasswordHtml(link)
    })
}

export {
    sendVerifyEmail,
    sendResetPasswordEmail
}