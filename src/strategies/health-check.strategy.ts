import { Strategy } from './base.strategy';
import { Observable, throwError } from 'rxjs';
import { HealthCheckFailedException } from '../exceptions';

export type HealthCheckOptions = () => boolean;

export class HealthCheckStrategy extends Strategy<HealthCheckOptions> {
	public constructor(options: HealthCheckOptions) {
		super(options);
	}

	public process<T>(observable: Observable<T>): Observable<T> {
		return this.options() ? observable : throwError(() => new HealthCheckFailedException());
	}
}
