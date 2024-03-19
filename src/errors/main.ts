import { BaseError } from "./base";
import { ErrorCodes } from "./types";

export class IndexNotProvided extends BaseError {
	constructor() {
		const msg = `Index is not provided in constructor nor method`;
		super(msg, ErrorCodes.IndexNotProvided);
	}
}
