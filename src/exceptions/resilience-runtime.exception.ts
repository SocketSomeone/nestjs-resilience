export class ResilienceRuntimeException extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'ResilienceRuntimeException';
	}
}
