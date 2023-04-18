export class ResilienceRuntimeException extends Error {
	constructor(message = ``) {
		super(message);
	}

	public what() {
		return this.message;
	}
}
