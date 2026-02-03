import mongoose, { model, models, Types } from "mongoose";

const Schema = mongoose.Schema;

export interface I_Share extends mongoose.Document {
    "hash": string;
    "userId": Types.ObjectId;
}

const shareSchema = new Schema<I_Share>({
    hash: { type: String, unique: true, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }
}, {
    timestamps: true
});


export const ShareModel = models.Share || model<I_Share>("Share", shareSchema);