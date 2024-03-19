import { BaseError } from "./base";
import { ErrorCodes } from "./types";
import { Indicies } from "../opensearch/types";

export class NotFoundError extends BaseError {
	constructor(params: { index: Indicies; id: string; external?: unknown }) {
		const msg = `Data with id ${params.id} is not found in indicie ${params.index}!`;
		super(msg, ErrorCodes.NotFound, params.external);
	}
}

export class UnexpectedError extends BaseError {
	constructor(params: unknown) {
		const msg = `Unexpected or unhandled error occur!`;
		super(msg, ErrorCodes.NotFound, params);
	}
}
