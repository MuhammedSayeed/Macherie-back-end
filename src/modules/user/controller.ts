import { AuthenticatedRequest } from "../../interfaces/auth";
import { catchError } from "../../middleware/catchError";
import sendError from "../../utils/SendError";
import { AuthService } from "../../services/AuthService";
import { TokenService } from "../../services/TokenService";
import { EmailService } from "../../services/EmailService";
import { UserService } from "../../services/UserService";
import { AppError } from "../../utils/AppError";
import { PasswordService } from "../../services/PasswordService";

const signup = catchError(async (req, res, next) => {
    const { name, email, phone, password } = req.body;

    // register user
    const user = await AuthService.registerUser({ name, email, phone, password });

    // send verification email
    await EmailService.sendVerificationEmail(user._id as string, user.email);

    const userResponse = AuthService.createUserResponse(user);

    const token = TokenService.generateAccessToken(userResponse);

    res.status(201).json({
        success: true,
        results: {
            token,
            user: userResponse,
        }
    })

})
const login = catchError(async (req, res, next) => {
    const { email, password } = req.body;

    // check if user exists
    const user = await AuthService.authenticateUser(email, password);

    // create user data
    const userResponse = AuthService.createUserResponse(user);
    // create token
    const token = TokenService.generateAccessToken(userResponse);

    // send response
    res.status(200).json({
        success: true,
        results: {
            token,
            user: userResponse,
        }
    })
})
const forgotPassword = catchError(async (req, res, next) => {
    const { email } = req.body;
    // check if user exists
    const user = await UserService.findUserByEmail(email)

    // check if there are prev token
    const aliveToken = await TokenService.getPasswordResetTokenByUserId(user._id as string);
    if (aliveToken) throw new AppError("Reset password mail already sent", 404);

    // create token
    const newToken = TokenService.generateAccessToken({
        _id: user._id,
        name: user.name,
        email: user.email
    }, "15m");

    // hash raw token
    const hashedToken = TokenService.hashByCrypto(newToken);

    // save hashed token
    await TokenService.savePasswordResetToken(user._id as string, hashedToken);

    // send email
    await EmailService.sendPasswordResetEmail(email, hashedToken);

    res.status(200).json({
        success: true,
        results: {
            message: "Password reset link sent to your email",
        }
    })

})
const resetPassword = catchError(async (req, res, next) => {
    const { token, password } = req.body;

    const passwordResetToken = await TokenService.getPasswordResetTokenByHashedToken(token);

    // hash password
    const hashedPassword = await PasswordService.hashPassword(password);

    // update user password
    await UserService.updateUserPassword(passwordResetToken.user, hashedPassword);

    // delete token
    await TokenService.deletePasswordResetToken(passwordResetToken._id as string);

    // update last time user changed password
    await UserService.updateLastTimePasswordChanged(passwordResetToken.user);

    res.status(200).json({
        success: true,
    })
})
const me = catchError(async (req: AuthenticatedRequest, res, next) => {
    const userId = req.user?._id;
    const user = await UserService.getUserById(userId as string);
    const userResponse = AuthService.createUserResponse(user);
    res.status(200).json({
        success: true,
        results: userResponse

    })
})
const verifyToken = catchError(async (req: AuthenticatedRequest, res, next) => {
    let token = req.headers.authorization?.split(" ")[1];
    if (!token) return sendError(next, "Unauthorized", 401);
    const decoded = TokenService.verifyToken(token);
    req.user = decoded;
    next();
})

export {
    signup,
    me,
    verifyToken,
    login,
    forgotPassword,
    resetPassword
}