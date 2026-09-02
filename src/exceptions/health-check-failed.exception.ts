import { ResilienceRuntimeException } from './resilience-runtime.exception.js';

export class HealthCheckFailedException extends ResilienceRuntimeException {
	public constructor() {
		super('Health check failed');
	}
}
