import mongoose from 'mongoose';
const { Schema } = mongoose;


const verificationCode = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    code: {
        type: String,
    },
    expireDate: {
        type: Date,
        default: () => new Date(Date.now() + 15 * 60 * 1000),
    },
    isUsed: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true,
});
export default mongoose.model('VerificationCode', verificationCode);