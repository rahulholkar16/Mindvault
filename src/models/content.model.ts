import mongoose, { Types } from "mongoose";

const Schema = mongoose.Schema;

export interface I_Content extends mongoose.Document {
    "_id": Types.ObjectId,
    "title": string,
    "url"?: string,
    "tags"?: Types.ObjectId[],
    "type"?: "document" | "video" | "tweets" | "link",
    "userId": Types.ObjectId,
    "isPublic"?: boolean
};

const content = new Schema<I_Content>({
    title: { type: String, required: true },
    url: { type: String },
    tags: [ { type: mongoose.Types.ObjectId, ref: "Tag" } ],
    type: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: "user", required: true },
    isPublic: { type: Boolean, default: false }
}, {timestamps: true});

content.pre("deleteOne", async function (this: I_Content, next) {
    const userId = this.userId;
    await mongoose.model("User").updateOne(
        { _id: userId },
        { $pull: { content: this._id } }
    );
    next();
});

content.pre("save", async function (next) {
    if (this.type !== "video" || !this.url) return next();
    
    const url = this.url; 
    let videoId: string | undefined;

    if (url.includes("youtu.be")) {
        videoId = url.split("youtu.be/")[1];
    } else if (url.includes("v=")) {
        videoId = url.split("v=")[1]?.split("&")[0];
    }

    if (!videoId) return next();

    this.url = `https://www.youtube.com/embed/${videoId}`;
    next();
});

export const ContentModel = (mongoose.models?.Content as mongoose.Model<I_Content>) || (mongoose.model<I_Content>("Content", content));