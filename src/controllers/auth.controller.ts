import type { Request, Response } from "express";
import { UserModel } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
    emailVerificationContent,
    sendEmail,
} from "../services/sendMail.services.js";
import { ApiResponse } from "../utils/apiResponse.js";
import type { Types } from "mongoose";

const generateAccessAndRefreshToken = async (
    userId: string | Types.ObjectId
) => {
    try {
        const user = await UserModel.findById(userId);
        if (!user) throw new ApiError(404, "User not found");
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refershToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(
            500,
            "Something went wrong while generating access token."
        );
    }
};

export const register = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password } = req.validateData;
    const isExist = await UserModel.findOne({ email });
    if (isExist) throw new ApiError(409, "User already exists.");
    const newUser = await UserModel.create({
        name,
        email,
        password,
    });
    const { unHashedToken, hasedToken, tokenExpiry } =
        newUser.generateTempToken();
    newUser.verificationToken = hasedToken;
    newUser.verificationTokenExpire = tokenExpiry;
    await sendEmail({
        email: newUser.email,
        subject: "Plesase verify your email.",
        mailgenContent: emailVerificationContent(
            newUser.name,
            `${req.protocol}://${req.get(
                "host"
            )}/api/vi/user/verify-email/${unHashedToken}`
        ),
    });
    const data = await UserModel.findById(newUser._id).select(
        "-password -verificationToken -resetPasswordToken -refreshToken"
    );

    if (!data)
        throw new ApiError(500, "Something went wrong while Register a User.");
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { user: data },
                "User added successfully and verification email send"
            )
        );
});

export const login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password)
        throw new ApiError(401, "Email and Password required.");

    const user = await UserModel.findOne({ email });
    if (!user) throw new ApiError(404, "User not found!");

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) throw new ApiError(401, "Invalid Password!");

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        user._id
    );

    const loggedUser = await UserModel.findById(user._id).select(
        "-password -verificationToken -resetPasswordToken -refreshToken"
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedUser,
                    accessToken,
                    refreshToken,
                },
                "User logged in successfully."
            )
        );
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
    await UserModel.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                refreshToken: "",
            },
        },
        {
            new: true,
        },
    );

    const options = {
        httpOnly: true,
        secure: true
    };

    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out."));
});

export const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
    return res.status(200).json(new ApiResponse(200, req.user, "Current User fetched successfully."));
});


