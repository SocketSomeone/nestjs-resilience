import { Strategy } from './base.strategy';
import { finalize, Observable, Subject, throwError } from 'rxjs';
import { BulkheadRejectedException } from '../exceptions';
import { BulkheadOptions } from '../interfaces';

export class BulkheadStrategy extends Strategy<BulkheadOptions> {
	private static readonly DEFAULT_OPTIONS: BulkheadOptions = {
		maxConcurrent: 1,
		maxQueue: 1
	};

	private active = 0;

	private queue: Observable<any>[] = [];

	private queue$ = new Subject<Observable<any>>();

	public get executionSlots(): number {
		return this.options.maxConcurrent - this.active;
	}

	public get queueSlots(): number {
		return this.options.maxQueue - this.queue.length;
	}

	public constructor(options?: BulkheadOptions) {
		super({ ...BulkheadStrategy.DEFAULT_OPTIONS, ...options });
	}

	public process<T>(observable: Observable<T>): Observable<T> {
		if (this.executionSlots > 0) {
			return this.concurrent(observable);
		}

		if (this.queueSlots > 0) {
			return this.enqueue(observable);
		}

		return throwError(
			() => new BulkheadRejectedException(this.options.maxConcurrent, this.options.maxQueue)
		);
	}

	private concurrent<T>(observable: Observable<T>): Observable<T> {
		this.active++;

		return observable.pipe(
			finalize(() => {
				this.active--;
				this.dequeue();
			})
		);
	}

	private enqueue<T>(observable: Observable<T>): Observable<T> {
		this.queue.push(observable);

		return new Observable(subscriber => {
			this.queue$.subscribe(queuedObservable => {
				if (queuedObservable === observable) {
					return this.concurrent(observable).subscribe(subscriber);
				}
			});
		});
	}

	private dequeue(): void {
		if (this.executionSlots === 0) {
			return;
		}

		const observable = this.queue.shift();

		if (!observable) {
			return;
		}

		return this.queue$.next(observable);
	}
}
