import mongoose from "mongoose";

const Schema = mongoose.Schema;

const content = new Schema({
    title: { type: String, required: true },
    url: { type: String },
    tags: [ { type: mongoose.Types.ObjectId, ref: "Tag" } ],
    userId: { type: Schema.Types.ObjectId, ref: "user", required: true },
});

export const ContentModel = mongoose.models?.Content || mongoose.model("Content", content);

