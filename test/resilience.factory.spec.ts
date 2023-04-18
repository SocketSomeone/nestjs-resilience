import {
	BulkheadStrategy,
	ResilienceFactory,
	RetryStrategy,
	Strategy,
	ThrottleStrategy,
	TimeoutStrategy
} from '../src';
import { Type } from '@nestjs/common';

describe('Resilience Factory', () => {
	const factory = new ResilienceFactory();

	const expectStrategy = (clazz: Type<Strategy>) => {
		return it(`should be able to create a ${clazz.name}`, () => {
			const strategy = factory.createStrategy(clazz, {});

			expect(strategy).toBeDefined();
			expect(strategy).toHaveProperty('process');
			expect(strategy).toBeInstanceOf(clazz);
		});
	};

	expectStrategy(BulkheadStrategy);
	expectStrategy(RetryStrategy);
	expectStrategy(ThrottleStrategy);
	expectStrategy(TimeoutStrategy);
});
