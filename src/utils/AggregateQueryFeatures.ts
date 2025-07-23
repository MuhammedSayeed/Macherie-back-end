import { IRequestQuery } from "../interfaces/request";
import { BaseQueryFeatures } from "./BaseQueryFeatures";
import { IVariant } from "../databases/models/variant"
import { Model } from 'mongoose';
import { PipelineStage } from 'mongoose';
import { ILookupOptions } from "../interfaces/aggregate";

class AggregateQueryFeatures extends BaseQueryFeatures {
    model: Model<IVariant>;
    pipeline: PipelineStage[] = [];
    _skip: number = 0;
    _limit: number = 5;

    constructor(model: Model<IVariant>, RequestQuery: IRequestQuery) {
        super(RequestQuery);
        this.model = model;
        this.pipeline = [];
    }
    match(conditions: Record<string, any>) {
        this.pipeline.push({ $match: conditions });
        return this;
    }
    lookup(options: ILookupOptions) {
        this.pipeline.push({
            $lookup: {
                from: options.from,
                localField: options.localField,
                foreignField: options.foreignField,
                as: options.as,
                pipeline: options.pipeline || []
            }
        })

        return this;
    }
    unwind(options: { path: string; preserveNullAndEmptyArrays?: boolean }) {
        this.pipeline.push({
            $unwind: {
                path: options.path,
                preserveNullAndEmptyArrays: options.preserveNullAndEmptyArrays ?? false,
            }
        });
        return this;
    }
    paginate() {
        const page = this.getPage();
        const limit = this.getLimit();
        const skip = (page - 1) * limit;

        this._skip = skip;
        return this;
    }
    sort() {
        if (this.RequestQuery.sort) {
            const sortBy = this.RequestQuery.sort?.split(',').join(' ') || '';
            const sortFields: Record<string, 1 | -1> = {};
            sortBy.split(' ').forEach(f => {
                const direction = f.startsWith('-') ? -1 : 1;
                const field = f.replace(/^-/, '');
                sortFields[field] = direction;
            });

            // Tie-breaker
            if (!sortFields['_id']) sortFields['_id'] = 1;

            this.pipeline.push({ $sort: sortFields });
        }
        return this;
    }
    addFields(fields: Record<string, string>) {
        this.pipeline.push({ $addFields: fields });
        return this;
    }
    projectFields(fields: Record<string, number>) {
        this.pipeline.push({ $project: fields });
        return this;
    }
    // remove skip and limit from pipeline temporarily to calculate totalDocs
    #buildCountPipeline() {
        return this.pipeline.filter(
            stage => !('$skip' in stage || '$limit' in stage)
        );
    }
    async #getTotalDocs() {
        const countPipeline = [...this.#buildCountPipeline(), { $count: "totalDocs" }];
        const result = await this.model.aggregate(countPipeline);
        return result[0]?.totalDocs || 0;
    }
    #applyPaginationStages() {
        const limit = this.getLimit();
        if (typeof this._skip === "number" && typeof limit === "number") {
            this.pipeline.push(
                { $skip: this._skip },
                { $limit: limit }
            );
        }
    }
    async executeFinalPipeline() {
        return await this.model.aggregate(this.pipeline);
    }
    async execute() {
        const totalDocs = await this.#getTotalDocs();
        this.calculateMetadata(totalDocs);
        this.#applyPaginationStages();
        const data = await this.executeFinalPipeline();
        return {
            metaData: this.metaData,
            results: data
        };
    }
}

export { AggregateQueryFeatures };
