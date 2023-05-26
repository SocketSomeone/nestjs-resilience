import { BaseCommand, ReturnTypeOfRun } from './base.command';
import { catchError, Observable, tap } from 'rxjs';
import { ResilienceEventType } from '../enum';

export abstract class ResilienceObservableCommand extends BaseCommand {
	public abstract run(...args: any[]): Observable<any>;

	public execute(...args: Parameters<this['run']>): ReturnTypeOfRun<this> {
		this.eventBus.emit(ResilienceEventType.Emit, this);

		let observable = this.run(...args);

		for (const strategy of this.strategies) {
			observable = strategy.process(observable, this, ...args);
		}

		return observable.pipe(
			catchError(error => {
				throw this.onFailure(error);
			}),
			tap(() => this.onSuccess())
		) as ReturnTypeOfRun<this>;
	}
}
