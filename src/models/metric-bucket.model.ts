import { ResilienceEventType } from '../enum';

export class MetricBucket {
	public readonly group: string;

	public readonly name: string;

	public constructor(
		public success: number = 0,
		public failure: number = 0,
		public timeout: number = 0,
		public shortCircuit: number = 0
	) {}

	public incrementBy(eventType: ResilienceEventType) {
		switch (eventType) {
			case ResilienceEventType.Success:
				this.success++;
				break;
			case ResilienceEventType.Failure:
				this.failure++;
				break;
			case ResilienceEventType.Timeout:
				this.timeout++;
				break;
			case ResilienceEventType.ShortCircuit:
				this.shortCircuit++;
				break;
		}
	}

	public get total(): number {
		return this.success + this.failure + this.timeout + this.shortCircuit;
	}

	public get successRate(): number {
		return this.total ? this.success / this.total : 0;
	}

	public get failureRate(): number {
		return this.total ? this.failure / this.total : 0;
	}

	public get failurePercentage(): number {
		return this.total ? (this.failure / this.total) * 100 : 0;
	}

	public get timeoutRate(): number {
		return this.total ? this.timeout / this.total : 0;
	}

	public get shortCircuitRate(): number {
		return this.total ? this.shortCircuit / this.total : 0;
	}

	public toJSON() {
		return {
			success: this.success,
			failure: this.failure,
			timeout: this.timeout,
			shortCircuit: this.shortCircuit,
			total: this.total,
			successRate: this.successRate,
			failureRate: this.failureRate,
			failurePercentage: this.failurePercentage,
			timeoutRate: this.timeoutRate,
			shortCircuitRate: this.shortCircuitRate
		};
	}

	public toString() {
		return Object.entries(this.toJSON())
			.map(([key, value]) => `${key}: ${value}`)
			.join(', ');
	}
}
