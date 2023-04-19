import { Strategy } from './base.strategy';
import { catchError, Observable, of } from 'rxjs';

export type FallbackOptions = () => any;

export class FallbackStrategy extends Strategy<FallbackOptions> {
	public constructor(options: FallbackOptions) {
		super(options);
	}

	public process<T>(observable: Observable<T>): Observable<T> {
		return observable.pipe(catchError(() => of(this.options())));
	}
}
