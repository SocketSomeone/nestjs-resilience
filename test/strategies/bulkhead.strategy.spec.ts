import { BulkheadRejectedException, BulkheadStrategy, sleep } from '../../src';
import { of } from 'rxjs';

describe('Bulkhead Strategy', () => {
	let strategy: BulkheadStrategy;

	const promise = () =>
		Promise.all([
			strategy.execute(async () => {
				await sleep(200);
				return 200;
			}),
			strategy.execute(async () => {
				await sleep(200);
				return 200;
			}),
			strategy.execute(async () => {
				await sleep(200);
				return 200;
			}),
			strategy.execute(async () => {
				await sleep(200);
				return 200;
			})
		]);

	beforeEach(() => {
		strategy = new BulkheadStrategy({
			maxConcurrent: 2,
			maxQueue: 2
		});
	});

	it('should be able to execute a promise', async () => {
		const value = await strategy.execute(async () => 1000);

		expect(value).toBe(1000);
	});

	it('should be able to execute an observable', done => {
		strategy.execute(of(1000)).subscribe(value => {
			expect(value).toBe(1000);
			done();
		});
	});

	it('should be able to execute a promise with maxConcurrent', async () => {
		const value = await promise();

		expect(value).toEqual([200, 200, 200, 200]);
	});

	it('should be able to handle error', async () => {
		const value = await strategy
			.execute(async () => {
				throw new Error('Test');
			})
			.catch(err => err.message);

		expect(value).toEqual('Test');
	});

	it('should be able to handle bulk rejection', done => {
		try {
			Promise.all([
				promise(),
				strategy.execute(async () => {
					await sleep(200);
					return 200;
				})
			]);
		} catch (err) {
			expect(err).toBeInstanceOf(BulkheadRejectedException);
			done();
		}
	});
});
