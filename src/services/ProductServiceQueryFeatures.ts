import { IVariant } from "../databases/models/variant";
import { IRequestQuery } from "../interfaces/request";
import { AggregateQueryFeatures } from "../utils/AggregateQueryFeatures";
import { Model } from "mongoose";

class ProductQueryService extends AggregateQueryFeatures {
    constructor(model: Model<IVariant>, requestQuery: IRequestQuery) {
        super(model, requestQuery);
    }

    attachProductDetails() {
        this.lookup({
            from: 'products',
            localField: 'product',
            foreignField: '_id',
            as: 'details'
        });
        return this;
    }
    unwindDetails() {
        this.unwind({
            path: '$details',
            preserveNullAndEmptyArrays: true
        });
        return this;
    }
    filterByProductMeta(Record: Record<string, any>) {
        this.match(Record)
        return this;
    }
    filterByColors() {
        if (this.RequestQuery.colors) {
            const colors = this.RequestQuery.colors.split(',').map(color => color.trim());
            if (colors.length > 0) {
                this.match({
                    'color.colorIdentifier': { $in: colors }
                })
            }
        }
        return this;
    }
    filterBySizes() {
        if (this.RequestQuery.sizes) {
            const sizes = this.RequestQuery.sizes.split(',').map(size => size.trim());
            if (sizes.length > 0) {
                this.match({
                    sizes: {
                        $elemMatch: {
                            size: { $in: sizes },
                            stock: { $gt: 0 }
                        }
                    }
                })
            }
        }
        return this;
    }
    mergeProductFields() {
        this.addFields({
            price: "$details.price",
            title: "$details.title",
            description: "$details.description",
            category: "$details.category",
            style: "$details.style",
            colors: "$details.colors",
            productId: "$details._id",
        })
        return this;
    }
    removeProductMeta() {
        this.projectFields({
            details: 0,
            product: 0,
            __v: 0,
            createdAt: 0,
            updatedAt: 0,
        });
        return this;
    }
}

export { ProductQueryService };