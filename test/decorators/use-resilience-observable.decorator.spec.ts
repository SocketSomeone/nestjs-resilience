import { of, tap, timeout } from 'rxjs';

import {
	FixedBackoff,
	RetryStrategy,
	TimeoutStrategy,
	UseResilienceObservable
} from '../../src/index.js';

const timeoutStrategy = new TimeoutStrategy(100);
const retryStrategy = new RetryStrategy({
	maxRetries: 3,
	backoff: FixedBackoff
});

vi.spyOn(FixedBackoff.prototype, 'getGenerator');

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

	it('should be able to execute a command', () => {
		return new Promise<void>(resolve => {
			userService.getUser('1').subscribe({
				next: value => {
					expect(value).toEqual({
						id: '1',
						name: 'John Doe'
					});
				},
				complete: () => {
					resolve();
				}
			});
		});
	});

	it('should be able get error', () => {
		return new Promise<void>(resolve => {
			userService.getUsers().subscribe({
				next: value => {
					expect(value).toEqual([{ id: '1', name: 'John Doe' }]);
				},
				complete: () => {
					resolve();
				}
			});
		});
	});
});
