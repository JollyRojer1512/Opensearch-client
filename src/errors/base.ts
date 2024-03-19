import { ErrorCodes } from "./types";

export abstract class BaseError {
	protected constructor(readonly message: string, readonly code: ErrorCodes, readonly externalError?: any) {}
}
