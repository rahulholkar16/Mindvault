import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ContentModel } from "../models/content.model.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const createContent = asyncHandler(async (req: Request, res: Response) => {
    const { title, tags, url, type } = req.body;
    const userId = req.user?._id;
    if (userId) throw new ApiError(400, "Unauthorized Access.");
    if (!title && !tags && !url && !type) throw new ApiError(400, "All field are required!");
    
    const data = await ContentModel.create({
        title,
        url,
        type,
        tags
    });

    res.status(200).json(
        new ApiResponse(200, data, "Content added successfully.");
    )
});