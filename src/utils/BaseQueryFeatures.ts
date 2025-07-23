import { IRequestQuery } from "../interfaces/request";



class BaseQueryFeatures {
    public RequestQuery: IRequestQuery;
    public metaData = {
        page: 1,
        limit: 5,
        totalDocs: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
    }
    constructor(RequestQuery: IRequestQuery) {
        this.RequestQuery = RequestQuery;


    }

    #isValidNumber(num: number) {
        return Number.isInteger(num) && num > 0;
    }

    getPage() {
        const page = parseInt(this.RequestQuery.page as string);
        return this.#isValidNumber(page) ? page : 1;
    }

    getLimit() {
        const limit = parseInt(this.RequestQuery.limit as string);
        return this.#isValidNumber(limit) ? limit : 5;
    }

    calculateMetadata(totalDocs: number) {
        const page = this.getPage();
        const limit = this.getLimit();
        const totalPages = Math.ceil(totalDocs / limit);
        const hasNextPage = page < totalPages;
        const hasPreviousPage = page > 1;
        this.metaData = {
            page,
            limit,
            totalDocs,
            totalPages,
            hasNextPage,
            hasPreviousPage,
        }

        return this.metaData;
    }
}

export{
    BaseQueryFeatures
}