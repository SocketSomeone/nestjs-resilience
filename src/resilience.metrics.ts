import { Injectable } from '@nestjs/common';
import { MetricBucket } from './models';
import { ResilienceEventType } from './enum';
import { ResilienceEventBus } from './resilience.event-bus';

@Injectable()
export class ResilienceMetrics {
	private readonly buckets = new Map<string, MetricBucket>();

	private readonly resilienceEventBus = ResilienceEventBus.getInstance();

	public constructor() {
		const registerEvent = (eventType: ResilienceEventType) => {
			return this.resilienceEventBus.on(eventType, ([command]) => {
				const bucket = this.getOrCreateBucket(command.group, command.name);
				bucket.incrementBy(eventType);
			});
		};

		registerEvent(ResilienceEventType.Success);
		registerEvent(ResilienceEventType.Failure);
		registerEvent(ResilienceEventType.Timeout);
		registerEvent(ResilienceEventType.ShortCircuit);
	}

	public getOrCreateBucket(group: string, name: string): MetricBucket {
		const key = `${group}.${name}`;

		if (!this.buckets.has(key)) {
			this.setBucket(group, name, new MetricBucket());
		}

		return this.getBucket(group, name);
	}

	public setBucket(group: string, name: string, bucket: MetricBucket) {
		this.buckets.set(`${group}.${name}`, bucket);
	}

	public getBucket(group: string, name: string): MetricBucket {
		const key = `${group}.${name}`;
		if (!this.buckets.has(key)) {
			this.buckets.set(key, new MetricBucket());
		}
		return this.buckets.get(key);
	}

	public getBuckets(): Map<string, MetricBucket> {
		return this.buckets;
	}

	public getMetrics(): MetricBucket[] {
		return [...this.buckets.values()];
	}
}
