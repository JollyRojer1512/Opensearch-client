import { BaseError } from "../errors/base";
import { Indicies } from "./types";
import { NotFoundError, UnexpectedError } from "../errors/opensearch";

export type OpenSearchClientError = {
  name: string;
  message: string;
  stack: string;
  meta?: {
    body?: {
      _index: Indicies;
      _id: string;
      found?: boolean;
    };
    statusCode: number;
  };
};

export class OpenSearchErrorHandler {
  format(error: OpenSearchClientError | unknown): BaseError {
    if (this.isOpenSearchClientError(error))
      return this.formatOpenSearchError(error);

    return new UnexpectedError(error);
  }

  private formatOpenSearchError(error: OpenSearchClientError) {
    if (error?.meta?.body?.found === false)
      return new NotFoundError({
        index: error.meta.body._index,
        id: error.meta.body._id,
        external: error,
      });

    return new UnexpectedError(error.meta);
  }

  private isOpenSearchClientError(
    error: OpenSearchClientError | unknown
  ): error is OpenSearchClientError {
    return typeof error === "object" && error !== null && "meta" in error;
  }
}
