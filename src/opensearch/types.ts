import { NestedObject } from "../utils/types";
import { RequestParams } from "@opensearch-project/opensearch";
import { MockObject } from "../models/mock";

export enum Indicies {
  indexName = "indexName",
}
export enum Analyzers {
  latin = "latin",
}

export type CreateParams<Index extends Indicies | undefined> =
  MethodIndexParams<Index> &
    Pick<RequestParams.Create<OpenSearchIndexModel<Index>>, "id" | "body">;

export type UpdateParams<Index extends Indicies | undefined> =
  MethodIndexParams<Index> &
    Pick<
      RequestParams.Update<OpenSearchIndexModel<Index>>,
      "id" | "body" | "refresh"
    >;

export type GetParams<Index extends Indicies | undefined> =
  MethodIndexParams<Index> & Pick<RequestParams.Get, "id">;

type MultiMatchQuery<Index extends Indicies | undefined> = {
  multi_match: {
    query?: string;
    fields?: (keyof OpenSearchIndexModel<Index>)[] | ["*"];
    fuzziness?: "AUTO";
    analyzer?: Analyzers;
  };
};
export type SearchParams<Index extends Indicies | undefined> =
  MethodIndexParams<Index> & {
    body: {
      from?: number;
      size?: number;
      query: MultiMatchQuery<Index>;
    };
  };

type MethodIndex<Index> = { index: Index };
export type MethodIndexParams<Index extends Indicies | undefined> =
  Index extends undefined ? MethodIndex<Indicies> : Partial<MethodIndex<Index>>;

export type OpenSearchIndexModelBasedOnIndex<Index> =
  Index extends Indicies.indexName ? MockObject : never;
export type OpenSearchIndexModel<Index> =
  OpenSearchIndexModelBasedOnIndex<Index> extends never | undefined
    ? never
    : NestedObject<OpenSearchIndexModelBasedOnIndex<Index>>;

type OpenSearchResponseShards = {
  total: number;
  successful: number;
  skipped?: number;
  failed: number;
};
export type OpenSearchHitsTotal = {
  value: number;
  relation: "eq" | "gte";
};
export type OpenSearchGetResponse<Index> = {
  _index: Index;
  _id: string;
  _version: number;
  _seq_no: number;
  _primary_term: number;
  found: boolean;
  _source: OpenSearchIndexModel<Index>;
};
export type OpenSearchCreateResponse = {
  _index: Indicies;
  _id: string;
  _version: number;
  result: "noop" | "created" | "updated";
  _shards: OpenSearchResponseShards;
  _seq_no: number;
  _primary_term: number;
};
export type OpenSearchUpdateResponse = OpenSearchCreateResponse;
export type OpenSearchSearchResponse<Index> = {
  took: number;
  timed_out: boolean;
  _shards: OpenSearchResponseShards;
  hits: {
    total: OpenSearchHitsTotal;
    max_score: number;
    hits: {
      _index: Index;
      _id: string;
      _score: number;
      _source: OpenSearchIndexModel<Index>;
    }[];
  };
};
