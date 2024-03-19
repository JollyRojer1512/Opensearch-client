import {
    Indicies,
    OpenSearchHitsTotal,
    OpenSearchIndexModel,
    OpenSearchSearchResponse,
} from "../../../opensearch/types";

export class OpenSearchSearchResponseEntity<Index extends Indicies | undefined> {
    readonly total: OpenSearchHitsTotal;
    readonly maxScore: number;
    readonly hits: { id: string; index: Index; score: number; data: OpenSearchIndexModel<Index> }[];
    constructor(params: OpenSearchSearchResponse<Index>) {
        this.total = params.hits.total;
        this.maxScore = params.hits.max_score;
        this.hits = params.hits.hits.map((hit) => {
            return {
                id: hit._id,
                index: hit._index,
                score: hit._score,
                data: hit._source,
            };
        });
    }

    get elements(): OpenSearchIndexModel<Index>[] {
        return this.hits.map((hit) => hit.data);
    }
}
