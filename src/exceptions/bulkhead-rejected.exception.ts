import { ResilienceRuntimeException } from './resilience-runtime.exception.js';

export class BulkheadRejectedException extends ResilienceRuntimeException {
	public constructor(executionSlots: number, queueSlots: number) {
		super(
			`Bulkhead capacity exceeded (0/${executionSlots} execution slots, 0/${queueSlots} available)`
		);
	}
}
