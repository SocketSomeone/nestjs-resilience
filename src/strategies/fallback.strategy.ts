import { Strategy } from './base.strategy';
import { catchError, Observable, of } from 'rxjs';
import { FallbackOptions } from '../interfaces';

export class FallbackStrategy extends Strategy<FallbackOptions> {
	public constructor(options: FallbackOptions) {
		super(options);
	}

	public process<T>(observable, ...args): Observable<T> {
		return observable.pipe(catchError(() => of(this.options(...args))));
	}
}
