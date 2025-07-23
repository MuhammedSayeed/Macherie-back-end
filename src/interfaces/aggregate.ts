import { PipelineStage } from "mongoose";

export interface ILookupOptions {
    from: string;
    localField: string;
    foreignField: string;
    as: string;
    pipeline?: any;
}