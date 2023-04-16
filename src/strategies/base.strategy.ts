import { defer, lastValueFrom, Observable } from 'rxjs';
import * as EventEmitter from 'events';
import { Logger } from '@nestjs/common';

type ObservableFactory<T> = () => Promise<T> | Observable<T>;

export abstract class Strategy<Options> extends EventEmitter {
	protected readonly logger = new Logger(this.constructor.name);

	public constructor(protected readonly options: Options) {
		super();
	}

	protected abstract process<T>(observable: Observable<T>): Observable<T>;

	public execute<T>(fn: ObservableFactory<T>): Promise<T>;
	public execute<T>(fn: Observable<T>): Observable<T>;
	public execute<T>(fn: ObservableFactory<T> | Observable<T>): Promise<T> | Observable<T> {
		if (typeof fn === 'function') {
			const observable = defer(() => fn());

			return lastValueFrom(this.process(observable));
		}

		if (fn instanceof Observable) {
			return this.process(fn) as Observable<T>;
		}

		return fn;
	}
}
