import { BaseCommand, ReturnTypeOfRun } from './base.command';
import { catchError, Observable } from 'rxjs';

export abstract class ResilienceObservableCommand extends BaseCommand {
	public abstract run(...args: any[]): Observable<any>;

	public toObservable(...args: Parameters<this['run']>): ReturnTypeOfRun<this> {
		if (!this.getHealthCheck()) {
			return this.getFallbackOrThrow(args, new Error('Health check failed'));
		}

		let observable = this.run(...args);

		for (const strategy of this.strategies) {
			observable = strategy.process(observable);
		}

		return observable.pipe(
			catchError(err => {
				return this.getFallbackOrThrow(args, err);
			})
		) as ReturnTypeOfRun<this>;
	}
}
