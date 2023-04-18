import { Strategy } from './base.strategy';
import { finalize, Observable, Subject } from 'rxjs';
import { BulkheadRejectedException } from '../exceptions';

export interface BulkheadOptions {
	maxConcurrent: number;
	maxQueue: number;
}

export class BulkheadStrategy extends Strategy<BulkheadOptions> {
	private active = 0;

	private queue: Observable<any>[] = [];

	private queue$ = new Subject<Observable<any>>();

	private get executionSlots(): number {
		return this.options.maxConcurrent - this.active;
	}

	private get queueSlots(): number {
		return this.options.maxQueue - this.queue.length;
	}

	public process<T>(observable: Observable<T>): Observable<T> {
		if (this.executionSlots > 0) {
			return this.concurrent(observable);
		}

		if (this.queueSlots > 0) {
			return this.enqueue(observable);
		}

		throw new BulkheadRejectedException(this.options.maxConcurrent, this.options.maxQueue);
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
