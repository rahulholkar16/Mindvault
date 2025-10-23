import type { I_UserDocument } from "../models/user.model.ts";

declare global {
    namespace Express {
        interface Request {
            user?: I_UserDocument
        }
    }
}