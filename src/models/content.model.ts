import mongoose, { Types } from "mongoose";

const Schema = mongoose.Schema;

export interface I_Content extends mongoose.Document {
    "_id": Types.ObjectId,
    "title": string,
    "url"?: string,
    "tags"?: Types.ObjectId[],
    "userId": Types.ObjectId,
    "isPublic"?: boolean
};

const content = new Schema<I_Content>({
    title: { type: String, required: true },
    url: { type: String },
    tags: [ { type: mongoose.Types.ObjectId, ref: "Tag" } ],
    userId: { type: Schema.Types.ObjectId, ref: "user", required: true },
    isPublic: { type: Boolean, default: false }
});

export const ContentModel = mongoose.models?.Content || mongoose.model("Content", content);

