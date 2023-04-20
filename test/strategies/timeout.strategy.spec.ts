import { timer } from 'rxjs';
import { take } from 'rxjs/operators';
import { TimeoutException, TimeoutStrategy } from '../../src';

describe('TimeoutStrategy', () => {
	describe('constructor', () => {
		it('should throw an error when timeout is less than or equal to 0', () => {
			expect(() => new TimeoutStrategy(0)).toThrow(RangeError);
			expect(() => new TimeoutStrategy(-1)).toThrow(RangeError);
		});

		it('should set default options when no options are provided', () => {
			const strategy = new TimeoutStrategy();
			expect(strategy['options']).toEqual(1000);
		});

		it('should set provided options', () => {
			const strategy = new TimeoutStrategy(2000);
			expect(strategy['options']).toEqual(2000);
		});
	});

	describe('process', () => {
		it('should return the observable if it completes before the timeout', async () => {
			const strategy = new TimeoutStrategy(2000);
			const source$ = timer(1000).pipe(take(1));
			const result$ = await strategy.process(source$).toPromise();
			expect(result$).toEqual(0);
		});

		it('should throw TimeoutException if the observable takes longer than the timeout', async () => {
			const strategy = new TimeoutStrategy(1000);
			const source$ = timer(2000).pipe(take(1));
			await expect(strategy.process(source$).toPromise()).rejects.toThrow(TimeoutException);
		});
	});
});
