import type { Request, Response } from "express";
import { UserModel } from "../models/user.model.js"
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { emailVerificationContent, sendEmail } from "../services/sendMail.services.js";
import { ApiResponse } from "../utils/apiResponse.js";

const generateAccessAndRefreshToken = async (userId: string) => {
    try {
        const user = await UserModel.findById(userId);
        if(!user) throw new ApiError(404, "User not found");
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refershToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating access token.");
    }
};

export const registerUser = asyncHandler(async (req: Request, res: Response)=>{
    const { name, email, password } = req.validateData;
    const isExist = await UserModel.findOne({ email });
    if(isExist) throw new ApiError(409, "User already exists.");
    const newUser = await UserModel.create({
        name,
        email,
        password,
    });
    const { unHashedToken, hasedToken, tokenExpiry } = newUser.generateTempToken();

    newUser.verificationToken = hasedToken;
    newUser.verificationTokenExpire = tokenExpiry;

    await sendEmail({
        email: newUser.email,
        subject: "Plesase verify your email.",
        mailgenContent: emailVerificationContent(newUser.name, `${req.protocol}://${req.get("host")}/api/vi/user/verify-email/${unHashedToken}`)
    });
    console.log(newUser);
    
    const data = await UserModel.findById(newUser._id).select(
        "-password -verificationToken -resetPasswordToken -refreshToken"
    );
    if (!data) throw new ApiError(500, "Something went wrong while Register a User.");
    return res.status(200).json(
        new ApiResponse(200, { user: data }, "User added successfully and verification email send")
    )
});