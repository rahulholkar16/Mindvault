import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt, { type SignOptions } from "jsonwebtoken";

const Schema = mongoose.Schema;

const user = new Schema({
    "name": { type: String, required: true },
    "email": { type: String, unique: true, required: true },
    "password": { type: String, required: true },
    "avatar": { type: String },
    "isVerified": { type: Boolean, default: false },
    "verificationToken": { type: String },
    "verificationTokenExpire": { type: Date },
    "resetPasswordToken": { type: String },
    "resetPasswordTokenExpire": { type: Date },
    "refershToken": { type: String },
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
            _id: this._id,
            email: this.email,
        },
        process.env.ACCESS_JWT_SECRET!,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY! } as SignOptions
    );
};

