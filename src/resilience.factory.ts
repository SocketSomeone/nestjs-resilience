import { Injectable, Type } from '@nestjs/common';
import {
	RetryOptions,
	RetryStrategy,
	Strategy,
	TimeoutOptions,
	TimeoutStrategy
} from './strategies';

interface InstanceOptions {
	groupId: string;
	name: string;
}

@Injectable()
export class ResilienceFactory {
	public createRetryStrategy(options: RetryOptions) {
		return this.createStrategy(RetryStrategy, options);
	}

	public createTimeoutStrategy(options: TimeoutOptions) {
		return this.createStrategy(TimeoutStrategy, options);
	}

	public createStrategy<T>(strategy: Type<Strategy<T>>, options: T) {
		return new strategy(options);
	}
}
