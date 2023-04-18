import { BulkheadOptions, BulkheadRejectedException, BulkheadStrategy } from '../../src';
import { of, take } from 'rxjs';

describe('Bulkhead Strategy', () => {
	let bulkhead: BulkheadStrategy;
	const options: BulkheadOptions = { maxConcurrent: 2, maxQueue: 2 };

	beforeEach(() => {
		bulkhead = new BulkheadStrategy(options);
	});

	describe('constructor', () => {
		it('should create an instance of BulkheadStrategy', () => {
			expect(bulkhead).toBeInstanceOf(BulkheadStrategy);
		});

		it('should set the default options if none are provided', () => {
			const defaultBulkhead = new BulkheadStrategy();
			expect(defaultBulkhead['options']).toEqual({ maxConcurrent: 1, maxQueue: 1 });
		});

		it('should set the options passed in the constructor', () => {
			expect(bulkhead['options']).toEqual(options);
		});
	});

	describe('process', () => {
		it('should allow an observable to execute if there is room in the concurrency slots', done => {
			const observable = of('test').pipe(take(1));

			bulkhead.process(observable).subscribe(value => {
				expect(value).toEqual('test');
				done();
			});
		});

		it('should enqueue an observable if there is no room in the concurrency slots but there is room in the queue slots', done => {
			const observable1 = of('test1').pipe(take(1));
			const observable2 = of('test2').pipe(take(1));
			const observable3 = of('test3').pipe(take(1));

			bulkhead.process(observable1).subscribe(value => {
				expect(value).toEqual('test1');

				bulkhead.process(observable2).subscribe(value => {
					expect(value).toEqual('test2');

					bulkhead.process(observable3).subscribe(value => {
						expect(value).toEqual('test3');
						done();
					});

					expect(bulkhead['queue'].length).toEqual(1);
				});

				expect(bulkhead['queue'].length).toEqual(0);
			});
		});

		it('should throw a BulkheadRejectedException if there is no room in the concurrency slots or the queue slots', () => {
			const observable1 = of('test1').pipe(take(1));
			const observable2 = of('test2').pipe(take(1));
			const observable3 = of('test3').pipe(take(1));
			const observable4 = of('test4').pipe(take(1));

			bulkhead.process(observable1).subscribe();
			bulkhead.process(observable2).subscribe();

			expect(() => bulkhead.process(observable3)).not.toThrow();

			bulkhead.process(observable4).subscribe({
				error: err => {
					expect(err).toBeInstanceOf(BulkheadRejectedException);
				}
			});
		});
	});
});
