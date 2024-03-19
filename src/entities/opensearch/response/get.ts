import { Indicies, OpenSearchGetResponse, OpenSearchIndexModel } from "../../../opensearch/types";

export class OpenSearchGetResponseEntity<Index extends Indicies | undefined> {
    readonly element: OpenSearchIndexModel<Index>;
    constructor(params: OpenSearchGetResponse<Index>) {
        this.element = params._source;
    }
}
