import { Strategy } from './base.strategy';
import { CircuitBreakerState } from '../enum';
import { CircuitBreakerOptions } from '../interfaces';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { CircuitOpenedException } from '../exceptions';
import { TimeoutStrategy } from './timeout.strategy';
import { CacheStrategy } from './cache.strategy';

export class CircuitBreakerStrategy extends Strategy<CircuitBreakerOptions> {
	private static readonly DEFAULT_OPTIONS: CircuitBreakerOptions = {
		requestVolumeThreshold: 20,
		sleepWindowInMilliseconds: 5000,
		errorThresholdPercentage: 50
	};

	private readonly cacheStrategy = new CacheStrategy(this.options.cachedTimeoutInMilliseconds);

	private readonly timeoutStrategy = new TimeoutStrategy(this.options.timeoutInMilliseconds);

	private state: CircuitBreakerState = CircuitBreakerState.Closed;

	private failuresCount = 0;

	private openedAt = 0;

	public constructor(options?: CircuitBreakerOptions) {
		super({ ...CircuitBreakerStrategy.DEFAULT_OPTIONS, ...options });
	}

	public process<T>(observable: Observable<T>, ...args): Observable<T> {
		if (this.isOpen) {
			if (this.openedAt + this.options.sleepWindowInMilliseconds > Date.now()) {
				return this.getFallbackOrThrowError(new CircuitOpenedException());
			}

			this.state = CircuitBreakerState.HalfOpen;
		}

		if (this.options.cachedTimeoutInMilliseconds) {
			observable = this.cacheStrategy.process(observable, ...args);
		}

		if (this.options.timeoutInMilliseconds) {
			observable = this.timeoutStrategy.process(observable);
		}

		let wasError = false;

		return observable.pipe(
			catchError(error => {
				this.failuresCount++;

				if (this.failuresCount >= this.options.requestVolumeThreshold) {
					if (this.failuresPercentage >= this.options.errorThresholdPercentage) {
						this.state = CircuitBreakerState.Open;
						this.openedAt = Date.now();
					} else {
						this.failuresCount = 0;
					}
				}

				if (this.isHalfOpen) {
					this.state = CircuitBreakerState.Open;
					this.openedAt = Date.now();
				}

				wasError = true;

				return this.getFallbackOrThrowError(error);
			}),
			tap(() => {
				if (this.isHalfOpen && !wasError) {
					this.state = CircuitBreakerState.Closed;
				}
			})
		) as Observable<T>;
	}

	private getFallbackOrThrowError<T>(error: Error): Observable<T> {
		if (this.options.fallback) {
			return of(this.options.fallback(error));
		}

		return throwError(() => error);
	}

	private get failuresPercentage(): number {
		return (this.failuresCount / this.options.requestVolumeThreshold) * 100;
	}

	private get isClosed(): boolean {
		return this.state === CircuitBreakerState.Closed;
	}

	private get isHalfOpen(): boolean {
		return this.state === CircuitBreakerState.HalfOpen;
	}

	private get isOpen(): boolean {
		return this.state === CircuitBreakerState.Open;
	}
}
