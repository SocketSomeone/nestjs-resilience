import { TimeoutStrategy } from '../src/strategies';
import { delay, of } from 'rxjs';
import { ResilienceTimeoutException } from '../src/exceptions';

describe('Timeout Strategy', () => {
	const strategy = new TimeoutStrategy({ timeout: 100 });

	it('should be able to timeout a promise', done => {
		strategy
			.execute(() => new Promise(resolve => setTimeout(() => resolve(1000), 1000)))
			.catch(error => {
				expect(error).toBeInstanceOf(ResilienceTimeoutException);
				done();
			});
	});

	it('should be able to timeout an observable', done => {
		strategy.execute(of(1000).pipe(delay(1000))).subscribe({
			error: error => {
				expect(error).toBeInstanceOf(ResilienceTimeoutException);
				done();
			}
		});
	});

	it('should be able return a value of observable', done => {
		strategy.execute(of(1000).pipe(delay(100))).subscribe({
			next: value => {
				expect(value).toBe(1000);
			},
			complete: () => {
				done();
			}
		});
	});

	it('should be able return a value of promise', done => {
		strategy
			.execute(() => Promise.resolve(1000))
			.then(value => {
				expect(value).toBe(1000);
				done();
			});
	});
});
