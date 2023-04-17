import { Injectable, Logger, Type } from '@nestjs/common';
import {
	RetryOptions,
	RetryStrategy,
	Strategy,
	TimeoutOptions,
	TimeoutStrategy
} from './strategies';

@Injectable()
export class ResilienceFactory {
	private readonly logger = new Logger(ResilienceFactory.name);

	private readonly instances: Map<string, Strategy<any>> = new Map();

	public createRetryStrategy(options: RetryOptions) {
		return this.createStrategy(RetryStrategy, options);
	}

	public createTimeoutStrategy(options: TimeoutOptions) {
		return this.createStrategy(TimeoutStrategy, options);
	}

	public createStrategy<T>(strategy: Type<Strategy<T>>, options: T) {
		return new strategy(options);
	}

	public getStorage<T>() {
		return this.instances;
	}
}
