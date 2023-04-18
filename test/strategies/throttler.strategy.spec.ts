import { Observable } from 'rxjs';
import { ThrottleOptions, ThrottlerException, ThrottleStrategy } from '../../src';

describe('ThrottlerStrategy', () => {
	describe('constructor', () => {
		it('should set default options if none provided', () => {
			const strategy = new ThrottleStrategy();
			expect(strategy['options']).toEqual({
				ttl: 1000,
				limit: 10
			});
		});

		it('should set provided options', () => {
			const options: ThrottleOptions = {
				ttl: 500,
				limit: 5
			};
			const strategy = new ThrottleStrategy(options);
			expect(strategy['options']).toEqual(options);
		});

		it('should throw error if ttl is less than or equal to 0', () => {
			const options: ThrottleOptions = {
				ttl: 0,
				limit: 5
			};
			expect(() => new ThrottleStrategy(options)).toThrowError(RangeError);
		});

		it('should throw error if limit is less than or equal to 0', () => {
			const options: ThrottleOptions = {
				ttl: 500,
				limit: 0
			};
			expect(() => new ThrottleStrategy(options)).toThrowError(RangeError);
		});
	});

	describe('process', () => {
		let strategy: ThrottleStrategy;

		beforeEach(() => {
			strategy = new ThrottleStrategy({
				ttl: 500,
				limit: 2
			});
		});

		it('should return the observable', () => {
			const observable = new Observable<number>();
			const result = strategy.process(observable);
			expect(result).toBe(observable);
		});

		it('should throw error if limit is reached', () => {
			strategy.process(new Observable<number>());
			strategy.process(new Observable<number>());
			expect(() => strategy.process(new Observable<number>())).toThrowError(
				ThrottlerException
			);
		});
	});
});
