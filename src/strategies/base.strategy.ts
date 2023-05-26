import { Observable } from 'rxjs';
import { Logger } from '@nestjs/common';
import { BaseCommand } from '../commands';

export abstract class Strategy<Options = any> {
	protected readonly logger = new Logger(this.constructor.name);

	protected constructor(protected options: Options) {}

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

	public abstract process<T>(
		observable: Observable<T>,
		command: BaseCommand,
		...args
	): Observable<T>;
}
