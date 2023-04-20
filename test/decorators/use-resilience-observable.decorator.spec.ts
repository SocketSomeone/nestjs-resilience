import { FixedBackoff, RetryStrategy, TimeoutStrategy, UseResilienceObservable } from '../../src';
import { of, tap, timeout } from 'rxjs';

const timeoutStrategy = new TimeoutStrategy(100);
const retryStrategy = new RetryStrategy({
	maxRetries: 3,
	backoff: FixedBackoff
});

const spyOnRetry = jest.spyOn(FixedBackoff.prototype, 'getGenerator');

class UserService {
	@UseResilienceObservable(timeoutStrategy)
	getUser(id: string) {
		return of({ id, name: 'John Doe' });
	}

	private usersCalls = 0;

	@UseResilienceObservable(timeoutStrategy, retryStrategy)
	getUsers() {
		return of([{ id: '1', name: 'John Doe' }]).pipe(
			tap(() => {
				if (this.usersCalls === 0) {
					this.usersCalls += 1;
					throw new Error('Error');
				}

				if (this.usersCalls === 1) {
					this.usersCalls += 1;

					return timeout(1000);
				}
			})
		);
	}
}

describe('Resilience Observable Decorator', () => {
	const userService = new UserService();

	it('should be able to execute a command', done => {
		userService.getUser('1').subscribe({
			next: value => {
				expect(value).toEqual({
					id: '1',
					name: 'John Doe'
				});
			},
			complete: () => {
				done();
			}
		});
	});

	it('should be able get error', done => {
		userService.getUsers().subscribe({
			next: value => {
				expect(value).toEqual([{ id: '1', name: 'John Doe' }]);
			},
			complete: () => {
				done();
			}
		});
	});
});
