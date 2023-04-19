import { ResilienceRuntimeException } from './resilience-runtime.exception';

export class CircuitOpenedException extends ResilienceRuntimeException {
	public constructor() {
		super(`Circuit is open`);
	}
}
