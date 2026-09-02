import { Observable, throwError } from 'rxjs';

import { HealthCheckFailedException } from '../exceptions/index.js';
import { HealthCheckOptions } from '../interfaces/index.js';
import { Strategy } from './base.strategy.js';

export class HealthCheckStrategy extends Strategy<HealthCheckOptions> {
	public constructor(options: HealthCheckOptions) {
		super(options);
	}

	public process<T>(observable: Observable<T>): Observable<T> {
		return this.options() ? observable : throwError(() => new HealthCheckFailedException());
	}
}
