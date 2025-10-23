import mongoose, { Model, Types } from "mongoose";
import bcrypt from "bcrypt";
import jwt, { type SignOptions } from "jsonwebtoken";
import crypto from "crypto";

const Schema = mongoose.Schema;

export interface I_UserDocument extends mongoose.Document {
    "name": string,
    "email": string,
    "password": string,
    "avatar"?: string,
    "content": Types.ObjectId[],
    "isVerified": boolean,
    "verificationToken"?: string,
    "verificationTokenExpire"?: Date,
    "resetPasswordToken"?: string,
    "resetPasswordTokenExpire"?: Date,
    "refershToken"?: string
};

const user = new Schema<I_UserDocument>({
    "name": { type: String, required: true },
    "email": { type: String, unique: true, required: true },
    "password": { type: String, required: true },
    "avatar": { type: String },
    "content": [{ type: Schema.Types.ObjectId, ref: "Content" }],
    "isVerified": { type: Boolean, default: false },
    "verificationToken": { type: String },
    "verificationTokenExpire": { type: Date },
    "resetPasswordToken": { type: String },
    "resetPasswordTokenExpire": { type: Date },
    "refershToken": { type: String }
}, {timestamps: true});

user.pre("save", async function (next) {
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

user.methods.isPasswordCorrect = async function (password: string) {
    return await bcrypt.compare(password, this.password);
};

user.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id as string,
            email: this.email,
        },
        process.env.ACCESS_JWT_SECRET!,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY! } as SignOptions
    );
};

user.methods.grnerateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
        },
        process.env.REFRESH_JWT_SECRET!,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY } as SignOptions
    );
};

user.methods.generateTempToken = function () {
    const unHashedToken = crypto.randomBytes(20).toString("hex");
    const hasedToken = crypto
            .createHash("sha256")
            .update(unHashedToken)
            .digest("hex");
    const tokenExpiry = Date.now() + (10*60*1000);
    return { unHashedToken, hasedToken, tokenExpiry };
}

export const UserModel = (mongoose.models?.User as mongoose.Model<I_UserDocument>) || mongoose.model<I_UserDocument>("User", user);