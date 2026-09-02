import { catchError, Observable, of } from 'rxjs';

import { FallbackOptions } from '../interfaces/index.js';
import { BaseCommand } from '../commands/index.js';
import { Strategy } from './base.strategy.js';

export class FallbackStrategy extends Strategy<FallbackOptions> {
	public constructor(options: FallbackOptions) {
		super(options);
	}

	public process<T>(observable, command: BaseCommand, ...args): Observable<T> {
		return observable.pipe(catchError(() => of(this.options(command, ...args))));
	}
}
