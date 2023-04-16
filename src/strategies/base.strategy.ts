import { defer, lastValueFrom, Observable } from 'rxjs';
import * as EventEmitter from 'events';
import { Logger } from '@nestjs/common';

type ObservableFactory<T> = () => Promise<T> | Observable<T>;

export abstract class Strategy<Options> extends EventEmitter {
	protected readonly logger = new Logger(this.constructor.name);

	public constructor(protected options: Options) {
		super();
	}

	public setOptions(options: Options): void {
		this.options = options;
	}

	public updateOption<K extends keyof Options>(key: K, value: Options[K]): void {
		this.options[key] = value;
	}

	public updateOptions(options: Options): void {
		this.options = Object.assign(this.options, options);
	}

	public getOptions(): Options {
		return this.options;
	}

	public clone(): this {
		return new (this.constructor as any)(this.options);
	}

	protected abstract process<T>(observable: Observable<T>): Observable<T>;

	public execute<T>(fn: ObservableFactory<T>): Promise<T>;
	public execute<T>(fn: Observable<T>): Observable<T>;
	public execute<T>(fn: ObservableFactory<T> | Observable<T>): Promise<T> | Observable<T> {
		if (fn instanceof Observable) {
			return this.process(fn) as Observable<T>;
		}

		const observable = defer(() => fn());

		return lastValueFrom(this.process(observable));
	}
}
