import { ResilienceObservableCommand } from '../../src';
import { of, tap } from 'rxjs';
import { retryStrategy } from './fixtures/strategy.fixture';

class TestObservableCommand extends ResilienceObservableCommand {
	protected strategies = [retryStrategy];

	private count = 0;

	public run() {
		return of(1000).pipe(
			tap(() => {
				this.count += 1;

				if (this.count !== 3) {
					throw new Error('Test');
				}

				return 1000;
			})
		);
	}
}

describe('Resilience Observable Command', () => {
	it('should be able to retry an observable', done => {
		const command = new TestObservableCommand('test');
		const observable = command.execute();

		observable.subscribe({
			next: value => {
				expect(value).toBe(1000);
			},
			complete: () => {
				done();
			}
		});
	});
});
