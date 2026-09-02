import { ResilienceRuntimeException } from './resilience-runtime.exception.js';

export class CircuitOpenedException extends ResilienceRuntimeException {
	public constructor() {
		super(`Circuit is open`);
	}
}
