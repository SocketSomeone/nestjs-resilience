import { Strategy } from './base.strategy';
import { CircuitBreakerStatus } from '../enum';
import { CircuitBreakerOptions } from '../interfaces';
import { catchError, finalize, from, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { CircuitOpenedException } from '../exceptions';
import { TimeoutStrategy } from './timeout.strategy';
import { CacheStrategy } from './cache.strategy';
import { BaseCommand } from '../commands';
import { ResilienceStatesManager } from '../resilience.states-manager';

interface CircuitBreakerState {
	status: CircuitBreakerStatus;

	succeedsCount: number;

	failuresCount: number;

	openedAt: number;
}

export class CircuitBreakerStrategy extends Strategy<CircuitBreakerOptions> {
	private static readonly DEFAULT_OPTIONS: CircuitBreakerOptions = {
		requestVolumeThreshold: 20,
		sleepWindowInMilliseconds: 5000,
		errorThresholdPercentage: 50
	};

	private readonly cacheStrategy = new CacheStrategy(this.options.cachedTimeoutInMilliseconds);

	private readonly timeoutStrategy = new TimeoutStrategy(this.options.timeoutInMilliseconds);

	public constructor(options?: CircuitBreakerOptions) {
		super({ ...CircuitBreakerStrategy.DEFAULT_OPTIONS, ...options });
	}

	public process<T>(observable: Observable<T>, command: BaseCommand, ...args): Observable<T> {
		const statesManager = ResilienceStatesManager.getInstance();
		const key = [this.name, command].join('/');

		const state$ = from(
			statesManager.wrap<CircuitBreakerState>(key, async () => ({
				status: CircuitBreakerStatus.Closed,
				openedAt: 0,
				failuresCount: 0,
				succeedsCount: 0
			}))
		);

		return state$.pipe(
			switchMap(state => {
				const isOpen = () => state.status === CircuitBreakerStatus.Open;
				const isHalfOpen = () => state.status === CircuitBreakerStatus.HalfOpen;
				const failuresPercentage = () =>
					(state.failuresCount / this.options.requestVolumeThreshold) * 100;

				if (isOpen()) {
					if (state.openedAt + this.options.sleepWindowInMilliseconds > Date.now()) {
						return this.getFallbackOrThrowError(new CircuitOpenedException());
					}

					state.status = CircuitBreakerStatus.HalfOpen;
				}

				if (this.options.cachedTimeoutInMilliseconds) {
					observable = this.cacheStrategy.process(observable, command, ...args);
				}

				if (this.options.timeoutInMilliseconds) {
					observable = this.timeoutStrategy.process(observable);
				}

				let wasError = false;

				return observable.pipe(
					tap(() => (state.succeedsCount = state.succeedsCount + 1)),
					finalize(() => {
						if (
							state.succeedsCount + state.failuresCount >=
							this.options.requestVolumeThreshold
						) {
							state.succeedsCount = 0;
							state.failuresCount = 0;
						}

						if (isHalfOpen() && !wasError) {
							state.status = CircuitBreakerStatus.Closed;
						}

						statesManager.set(key, state);
					}),
					catchError(error => {
						state.failuresCount = state.failuresCount + 1;

						if (
							state.succeedsCount + state.failuresCount >=
							this.options.requestVolumeThreshold
						) {
							if (failuresPercentage() >= this.options.errorThresholdPercentage) {
								state.status = CircuitBreakerStatus.Open;
								state.openedAt = Date.now();
							}
						}

						if (isHalfOpen()) {
							state.status = CircuitBreakerStatus.Open;
							state.openedAt = Date.now();
						}

						wasError = true;

						return this.getFallbackOrThrowError(error);
					})
				);
			})
		) as Observable<T>;
	}

	private getFallbackOrThrowError<T>(error: Error): Observable<T> {
		if (this.options.fallback) {
			return of(this.options.fallback(error));
		}

		return throwError(() => error);
	}
}
