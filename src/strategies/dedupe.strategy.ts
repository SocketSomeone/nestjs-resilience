import { Strategy } from './base.strategy';
import { DedupeOptions } from '../interfaces';
import { Observable, Subject, tap } from 'rxjs';
import { BaseCommand } from '../commands';

export class DedupeStrategy extends Strategy<DedupeOptions> {
	private static readonly DEFAULT_OPTIONS: DedupeOptions = {
		keyFn: (args: any[], command: BaseCommand) =>
			[DedupeStrategy.name, command, JSON.stringify(args)].join('/')
	};

	private readonly activeCommands = new Map<string, Subject<any>>();

	public constructor(options?: DedupeOptions) {
		super({ ...DedupeStrategy.DEFAULT_OPTIONS, ...options });
	}

	public process<T>(
		observable: Observable<T>,
		command: BaseCommand,
		...args: any[]
	): Observable<T> {
		const key = this.options.keyFn(args, command);

		if (this.activeCommands.has(key)) {
			return this.activeCommands.get(key)!.asObservable();
		}

		const result = observable;
		const subject = new Subject();
		this.activeCommands.set(key, subject);

		return result.pipe(
			tap({
				next: res => {
					subject.next(res);
					subject.complete();
					this.activeCommands.delete(key);
				},
				error: err => {
					subject.error(err);
					subject.complete();
					this.activeCommands.delete(key);
				}
			})
		);
	}
}
